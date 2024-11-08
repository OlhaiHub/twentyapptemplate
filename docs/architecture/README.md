## Architecture Diagrams

### Infrastructure Architecture
```mermaid
graph TB
    %% Internet Gateway
    INTERNET((Internet)) --> ALB

    subgraph AWS["AWS Cloud"]
        subgraph NET["1-NETWORK LAYER"]
            subgraph VPC["NET-001: VPC (10.0.0.0/16)"]
                ALB["NET-002: Application Load Balancer"]
                
                subgraph PUB["NET-100: Public Subnets"]
                    PUB1["NET-101: Public-1A<br/>10.0.1.0/24"]
                    PUB2["NET-102: Public-1B<br/>10.0.2.0/24"]
                end
                
                subgraph PRIV["NET-200: Private Subnets"]
                    PRIV1["NET-201: Private-1A<br/>10.0.3.0/24"]
                    PRIV2["NET-202: Private-1B<br/>10.0.4.0/24"]
                end
                
                subgraph GW["NET-300: Gateways"]
                    IGW["NET-301: Internet Gateway"]
                    NAT["NET-302: NAT Gateway"]
                end
            end
        end

        subgraph SEC["2-SECURITY LAYER"]
            subgraph SG["SEC-100: Security Groups"]
                ALB_SG["SEC-101: ALB SG<br/>80,443"]
                EKS_SG["SEC-102: EKS SG<br/>443,10250"]
                NODE_SG["SEC-103: Node SG"]
            end
            
            subgraph IAM["SEC-200: IAM"]
                CLUSTER_ROLE["SEC-201: Cluster Role"]
                NODE_ROLES["SEC-202: Node Roles"]
                SA_ROLES["SEC-203: Service Accounts"]
            end
            
            subgraph KMS["SEC-300: Encryption"]
                EKS_KEY["SEC-301: EKS Key"]
                EBS_KEY["SEC-302: EBS Key"]
                SEC_KEY["SEC-303: Secrets Key"]
            end
        end

        subgraph EKS["3-EKS CLUSTER"]
            CP["EKS-001: Control Plane"]
            
            subgraph NG["EKS-100: Node Groups"]
                FNG["EKS-101: Frontend Nodes<br/>t3.medium x2"]
                BNG["EKS-102: Backend Nodes<br/>t3.large x2"]
                DNG["EKS-103: Database Node<br/>t3.xlarge x1"]
            end
            
            subgraph K8S["EKS-200: Kubernetes Resources"]
                NS["EKS-201: Namespaces"]
                ING["EKS-202: Ingress"]
                HPA["EKS-203: AutoScaling"]
            end
        end

        subgraph APP["4-APPLICATION LAYER"]
            subgraph FRONT["APP-100: Frontend Tier"]
                F_DEPLOY["APP-101: Frontend Deployment"]
                F_SVC["APP-102: Frontend Service"]
                F_CONFIG["APP-103: Frontend Config"]
            end
            
            subgraph BACK["APP-200: Backend Tier"]
                B_DEPLOY["APP-201: Backend Deployment"]
                B_SVC["APP-202: Backend Service"]
                B_CONFIG["APP-203: Backend Config"]
            end
            
            subgraph DB["APP-300: Database Tier"]
                DB_SS["APP-301: PostgreSQL StatefulSet"]
                DB_SVC["APP-302: Database Service"]
                DB_VOL["APP-303: Persistent Volume"]
            end
        end

        subgraph MON["5-MONITORING LAYER"]
            CW["MON-100: CloudWatch"]
            PROM["MON-200: Prometheus"]
            GRAF["MON-300: Grafana"]
            ALERT["MON-400: Alerting"]
        end

        subgraph DNS["6-DNS LAYER"]
            R53["DNS-100: Route 53"]
            CERT["DNS-200: ACM Certificate"]
            DOMAIN["DNS-300: mGenialdev.olhai.app.br"]
        end
    end

    %% Define relationships
    ALB --> FNG & BNG
    FNG & BNG & DNG --> CP
    
    F_DEPLOY --> FNG
    B_DEPLOY --> BNG
    DB_SS --> DNG
    
    CW --> EKS
    PROM --> K8S
    
    DOMAIN --> ALB

    classDef network fill:#E6F3FF,stroke:#3182CE
    classDef security fill:#FED7D7,stroke:#E53E3E
    classDef eks fill:#C6F6D5,stroke:#38A169
    classDef app fill:#E9D8FD,stroke:#805AD5
    classDef monitoring fill:#FEEBC8,stroke:#DD6B20
    classDef dns fill:#E2E8F0,stroke:#4A5568

    class NET,VPC,PUB,PRIV,GW,ALB network
    class SEC,SG,IAM,KMS security
    class EKS,CP,NG,K8S eks
    class APP,FRONT,BACK,DB app
    class MON,CW,PROM,GRAF,ALERT monitoring
    class DNS,R53,CERT,DOMAIN dns
```

### Deployment Workflow
```mermaid
sequenceDiagram
    participant NET as Network Layer
    participant SEC as Security Layer
    participant COMP as Compute Layer
    participant APP as Application Layer
    participant MON as Monitoring Layer
    participant DNS as DNS Layer

    Note over NET: Phase 1: Network Foundation
    NET->>NET: NET-001: Create VPC
    NET->>NET: NET-100: Configure Public Subnets
    NET->>NET: NET-200: Configure Private Subnets
    NET->>NET: NET-300: Setup Routing (IGW, NAT)
    NET->>NET: NET-400: Configure NACLs

    Note over SEC: Phase 2: Security Configuration
    SEC->>SEC: SEC-100: Create Security Groups
    SEC->>SEC: SEC-200: Setup IAM Roles/Policies
    SEC->>SEC: SEC-300: Configure Secrets Management

    Note over COMP: Phase 3: Compute Resources
    COMP->>COMP: COMP-100: Launch EC2 Instance
    COMP->>COMP: COMP-200: Setup Docker Platform
    
    Note over APP: Phase 4: Application Deployment
    APP->>APP: APP-100: Deploy Containers
    APP->>APP: APP-200: Configure Applications
    
    Note over MON: Phase 5: Monitoring Setup
    MON->>MON: MON-100: Enable CloudWatch
    MON->>MON: MON-200: Setup Logging
    MON->>MON: MON-300: Configure Alerts
    
    Note over DNS: Phase 6: DNS Configuration
    DNS->>DNS: DNS-100: Configure Route53
    DNS->>DNS: DNS-200: Create Records

    Note over NET,DNS: Implementation Complete
```

The infrastructure architecture diagram shows the AWS components and their relationships within the deployment, including:
- VPC and subnet configuration
- EC2 instance with Docker containers
- Security group rules
- Network components (IGW, NAT, Route Tables)
- DNS configuration

The deployment workflow diagram illustrates the sequential steps of the deployment process:
1. Initial script execution
2. Security group creation
3. EC2 instance launch
4. System configuration
5. Docker setup
6. Application deployment
7. DNS configuration

These visual representations help understand both the static infrastructure and the dynamic deployment process of the TwentyCRM development environment.
