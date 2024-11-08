## Architecture Diagrams

### Infrastructure Architecture
```mermaid
graph TB
    %% Internet Access
    INTERNET((Internet)) --> IGW

    subgraph AWS["AWS Cloud Infrastructure"]
        %% Network Layer
        subgraph NET["1-NETWORK LAYER"]
            subgraph VPC["NET-001: VPC (10.0.0.0/16)"]
                subgraph SUBNETS["Network Segments"]
                    PUB["NET-100: Public Subnets"]
                    PUB1["NET-101: Public 1a<br/>10.0.1.0/24"]
                    PUB2["NET-102: Public 1b<br/>10.0.2.0/24"]
                    PRIV["NET-200: Private Subnets"]
                    PRIV1["NET-201: Private 1a<br/>10.0.3.0/24"]
                    PRIV2["NET-202: Private 1b<br/>10.0.4.0/24"]
                end
                
                subgraph ROUTING["NET-300: Routing"]
                    IGW["NET-301: Internet Gateway"]
                    NAT["NET-302: NAT Gateway"]
                    RTB_PUB["NET-303: Public Routes"]
                    RTB_PRIV["NET-304: Private Routes"]
                end
            end
        end

        %% Security Layer
        subgraph SEC["2-SECURITY LAYER"]
            subgraph SECGRP["SEC-100: Security Groups"]
                SG_ALB["SEC-101: ALB SG<br/>IN: 80,443"]
                SG_EKS["SEC-102: EKS SG<br/>IN: 443,10250"]
                SG_NODE["SEC-103: Node SG<br/>IN: 22"]
                SG_DB["SEC-104: DB SG<br/>IN: 5432"]
            end
            
            subgraph IAM["SEC-200: IAM"]
                ROLE_EKS["SEC-201: EKS Role"]
                ROLE_NODE["SEC-202: Node Role"]
                ROLE_ALB["SEC-203: ALB Role"]
            end
            
            subgraph KMS["SEC-300: Encryption"]
                KEY_EKS["SEC-301: EKS Key"]
                KEY_EBS["SEC-302: EBS Key"]
            end
        end

        %% EKS Layer
        subgraph EKS["3-EKS LAYER"]
            subgraph CLUSTER["EKS-100: Cluster"]
                CP["EKS-101: Control Plane"]
                NG["EKS-102: Node Groups"]
                CNI["EKS-103: AWS CNI"]
            end
            
            subgraph K8S["EKS-200: Kubernetes"]
                NS["EKS-201: Namespaces"]
                DEPLOY["EKS-202: Deployments"]
                SVC["EKS-203: Services"]
                ING["EKS-204: Ingress"]
            end
            
            subgraph STORAGE["EKS-300: Storage"]
                CSI["EKS-301: EBS CSI"]
                SC["EKS-302: Storage Class"]
                PV["EKS-303: PV/PVC"]
            end
        end

        %% Application Layer
        subgraph APP["4-APPLICATION LAYER"]
            subgraph CONT["APP-100: Containers"]
                FRONT["APP-101: Frontend"]
                BACK["APP-102: Backend"]
                DB["APP-103: PostgreSQL"]
            end
            
            subgraph CONFIG["APP-200: Configs"]
                ENV["APP-201: Environment"]
                SECRET["APP-202: Secrets"]
            end
        end

        %% Monitoring Layer
        subgraph MON["5-MONITORING LAYER"]
            CW["MON-101: CloudWatch"]
            PROM["MON-102: Prometheus"]
            ALERT["MON-103: Alerts"]
            LOGS["MON-104: Logging"]
        end

        %% DNS Layer
        subgraph DNS["6-DNS LAYER"]
            R53["DNS-101: Route 53"]
            ZONE["DNS-102: Hosted Zone"]
            CERT["DNS-103: ACM Cert"]
        end
    end

    %% Relationships
    IGW --> PUB
    NAT --> PRIV
    PUB --> NAT
    
    SG_ALB --> CP
    SG_EKS --> NG
    
    ROLE_EKS --> CP
    ROLE_NODE --> NG
    
    CP --> K8S
    K8S --> CONT
    
    CONT --> CONFIG
    
    CW --> LOGS
    R53 --> ZONE

    classDef network fill:#e4f0f8,stroke:#336
    classDef security fill:#ffe4e4,stroke:#633
    classDef eks fill:#326ce5,stroke:#fff,color:#fff
    classDef app fill:#e3f9e3,stroke:#363
    classDef monitoring fill:#f0e4ff,stroke:#336
    classDef dns fill:#f4f4f4,stroke:#666

    class NET,VPC,SUBNETS,ROUTING network
    class SEC,SECGRP,IAM,KMS security
    class EKS,CLUSTER,K8S,STORAGE eks
    class APP,CONT,CONFIG app
    class MON,CW,PROM,ALERT,LOGS monitoring
    class DNS,R53,ZONE,CERT dns

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
