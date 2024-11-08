## Detailed Implementation Steps

### 1. Network Setup

```bash
# 1.1 Create VPC and Subnets for each environment
# Development Environment
aws ec2 create-vpc \
    --cidr-block 10.0.0.0/16 \
    --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=twenty-dev-vpc},{Key=Environment,Value=dev}]'

# Create Subnets
aws ec2 create-subnet \
    --vpc-id vpc-xxx \
    --cidr-block 10.0.1.0/24 \
    --availability-zone sa-east-1a \
    --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=twenty-dev-pub-1a}]'

# 1.2 Create Internet Gateway
aws ec2 create-internet-gateway \
    --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=twenty-dev-igw}]'

# 1.3 Create NAT Gateway
aws ec2 create-nat-gateway \
    --subnet-id subnet-xxx \
    --allocation-id eipalloc-xxx
```

### 2. Security Group Configuration

```bash
# 2.1 Create Security Groups
aws ec2 create-security-group \
    --group-name twenty-dev-alb-sg \
    --description "ALB Security Group" \
    --vpc-id vpc-xxx

# 2.2 Configure Security Group Rules
aws ec2 authorize-security-group-ingress \
    --group-id sg-xxx \
    --protocol tcp \
    --port 443 \
    --cidr 0.0.0.0/0
```

### 3. EKS Cluster Setup

```bash
# 3.1 Create EKS Cluster
aws eks create-cluster \
    --name twenty-dev-cluster \
    --role-arn arn:aws:iam::ACCOUNT_ID:role/Twenty-EKS-Role \
    --resources-vpc-config subnetIds=subnet-xxx,subnet-yyy,securityGroupIds=sg-xxx \
    --kubernetes-version 1.27

# 3.2 Create Node Groups
aws eks create-nodegroup \
    --cluster-name twenty-dev-cluster \
    --nodegroup-name twenty-dev-frontend \
    --node-role arn:aws:iam::ACCOUNT_ID:role/Twenty-Node-Role \
    --scaling-config minSize=2,maxSize=4,desiredSize=2 \
    --instance-types t3.medium
```

### 4. Database Setup

```bash
# 4.1 Launch EC2 Instance for PostgreSQL
aws ec2 run-instances \
    --image-id ami-xxx \
    --instance-type t3.large \
    --subnet-id subnet-xxx \
    --security-group-ids sg-xxx \
    --user-data file://db-setup.sh

# db-setup.sh content
#!/bin/bash
apt-get update
apt-get install -y postgresql-13 postgresql-contrib-13

# Configure PostgreSQL
cat << EOF >> /etc/postgresql/13/main/postgresql.conf
listen_addresses = '*'
max_connections = 200
shared_buffers = 4GB
work_mem = 64MB
maintenance_work_mem = 256MB
effective_cache_size = 12GB
EOF

# Initialize Database
sudo -u postgres psql << EOF
CREATE DATABASE twentydb;
CREATE USER twenty WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE twentydb TO twenty;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_graphql";
EOF
```

### 5. Kubernetes Resources

```yaml
# 5.1 Namespace
apiVersion: v1
kind: Namespace
metadata:
  name: twenty-dev

# 5.2 Frontend Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: twenty-frontend
  namespace: twenty-dev
spec:
  replicas: 2
  selector:
    matchLabels:
      app: twenty-frontend
  template:
    metadata:
      labels:
        app: twenty-frontend
    spec:
      containers:
      - name: frontend
        image: twentycrm/frontend:latest
        ports:
        - containerPort: 3001
        resources:
          requests:
            cpu: "1000m"
            memory: "2Gi"
          limits:
            cpu: "2000m"
            memory: "4Gi"
        readinessProbe:
          httpGet:
            path: /ready
            port: 3001
          initialDelaySeconds: 30
          periodSeconds: 10

# 5.3 Backend Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: twenty-backend
  namespace: twenty-dev
spec:
  replicas: 2
  template:
    spec:
      containers:
      - name: backend
        image: twentycrm/backend:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: url
```

### 6. Monitoring Setup

```yaml
# 6.1 Prometheus Configuration
apiVersion: monitoring.coreos.com/v1
kind: Prometheus
metadata:
  name: twenty-prometheus
  namespace: monitoring
spec:
  serviceAccountName: prometheus
  serviceMonitorSelector:
    matchLabels:
      team: twenty
  resources:
    requests:
      memory: 400Mi
  enableAdminAPI: false

# 6.2 Grafana Dashboard
apiVersion: integreatly.org/v1alpha1
kind: GrafanaDashboard
metadata:
  name: twenty-dashboard
  namespace: monitoring
spec:
  json: |
    {
      "title": "TwentyCRM Dashboard",
      "panels": [
        {
          "title": "Pod Status",
          "type": "graph",
          "datasource": "Prometheus"
        }
      ]
    }
```

### 7. Backup Configuration

```yaml
# 7.1 Velero Backup
apiVersion: velero.io/v1
kind: Backup
metadata:
  name: twenty-daily-backup
  namespace: velero
spec:
  includedNamespaces:
  - twenty-dev
  - twenty-qa
  - twenty-prod
  schedule: "0 1 * * *"
  ttl: 720h

# 7.2 Database Backup Script
#!/bin/bash
BACKUP_DIR="/backups/postgres"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_NAME="twentydb"
DB_USER="twenty"

# Create backup
pg_dump -U $DB_USER $DB_NAME | gzip > $BACKUP_DIR/backup_$TIMESTAMP.sql.gz

# Upload to S3
aws s3 cp $BACKUP_DIR/backup_$TIMESTAMP.sql.gz s3://twenty-backups/
```

### 8. Security Policies

```yaml
# 8.1 Network Policy
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: twenty-network-policy
  namespace: twenty-dev
spec:
  podSelector:
    matchLabels:
      app: twenty-backend
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: twenty-frontend
    ports:
    - protocol: TCP
      port: 3000

# 8.2 Pod Security Policy
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: twenty-restricted
spec:
  privileged: false
  seLinux:
    rule: RunAsAny
  runAsUser:
    rule: MustRunAsNonRoot
  fsGroup:
    rule: RunAsAny
  volumes:
  - 'configMap'
  - 'emptyDir'
  - 'persistentVolumeClaim'
  - 'secret'
```

[Would you like me to add:
1. Troubleshooting procedures
2. Maintenance guides
3. Scaling procedures
4. Disaster recovery procedures?]
