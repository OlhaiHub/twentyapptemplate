## Architecture Diagrams

### Infrastructure Architecture
```mermaid
graph TB
    subgraph NET["1-NETWORK LAYER"]
        subgraph VPC["NET-001: TwentyCRM-VPC (10.0.0.0/16)"]
            subgraph PUB["NET-100: Public Subnets"]
                PUB1["NET-101: Public Subnet 1<br/>10.0.1.0/24<br/>sa-east-1a"]
                PUB2["NET-102: Public Subnet 2<br/>10.0.2.0/24<br/>sa-east-1b"]
            end
            
            subgraph PRIV["NET-200: Private Subnets"]
                PRIV1["NET-201: Private Subnet 1<br/>10.0.3.0/24<br/>sa-east-1a"]
                PRIV2["NET-202: Private Subnet 2<br/>10.0.4.0/24<br/>sa-east-1b"]
            end
            
            subgraph ROUTE["NET-300: Routing"]
                IGW["NET-301: Internet Gateway"]
                NAT["NET-302: NAT Gateway"]
                RTP["NET-303: Public Route Table"]
                RTR["NET-304: Private Route Table"]
            end
            
            subgraph NACL["NET-400: Network ACLs"]
                NACLPUB["NET-401: Public NACL<br/>Allow 80,443,22"]
                NACLPRIV["NET-402: Private NACL<br/>Allow 5432"]
            end
        end
    end

    subgraph SEC["2-SECURITY LAYER"]
        subgraph SG["SEC-100: Security Groups"]
            SGAPP["SEC-101: App SG<br/>IN: 80,443<br/>OUT: ALL"]
            SGADM["SEC-102: Admin SG<br/>IN: 22<br/>OUT: ALL"]
            SGDB["SEC-103: DB SG<br/>IN: 5432<br/>OUT: ALL"]
        end
        
        subgraph IAM["SEC-200: IAM Configuration"]
            ROLE["SEC-201: EC2 Role"]
            S3POL["SEC-202: S3 Access"]
            SMPOL["SEC-203: Secrets Manager"]
            SSMPOL["SEC-204: Systems Manager"]
        end
        
        subgraph SECRETS["SEC-300: Secrets Management"]
            SM["SEC-301: Secrets Manager<br/>DB Credentials"]
            SSM["SEC-302: Parameter Store<br/>App Config"]
        end
    end

    subgraph COMP["3-COMPUTE LAYER"]
        subgraph EC2["COMP-100: EC2 Resources"]
            INST["COMP-101: t3.medium<br/>Ubuntu 20.04 LTS"]
            EBS1["COMP-102: Root EBS<br/>20GB GP3"]
            EBS2["COMP-103: Data EBS<br/>100GB GP3"]
        end
        
        subgraph DOCKER["COMP-200: Docker Platform"]
            ENGINE["COMP-201: Docker Engine"]
            COMPOSE["COMP-202: Docker Compose"]
            BENCH["COMP-203: Docker Bench Security"]
        end
    end

    subgraph APP["4-APPLICATION LAYER"]
        subgraph CONT["APP-100: Containers"]
            FRONT["APP-101: Frontend<br/>Port: 80"]
            BACK["APP-102: Backend<br/>Port: 3000"]
            DB["APP-103: PostgreSQL<br/>Port: 5432"]
        end
        
        subgraph CONF["APP-200: Configuration"]
            ENV["APP-201: Environment"]
            CREDS["APP-202: Credentials"]
        end
    end

    subgraph MON["5-MONITORING LAYER"]
        CW["MON-101: CloudWatch"]
        LOGS["MON-102: Container Logs"]
        TRAIL["MON-103: CloudTrail"]
        FLOW["MON-104: VPC Flow Logs"]
    end

    subgraph DNS["6-DNS LAYER"]
        R53["DNS-101: Route 53<br/>olhai.app.br"]
        AREC["DNS-102: A Record<br/>mGenialdev.olhai.app.br"]
    end

    %% Relationships
    IGW --> RTP
    NAT --> RTR
    RTP --> PUB1 & PUB2
    RTR --> PRIV1 & PRIV2
    
    SGAPP & SGADM & SGDB --> INST
    ROLE --> INST
    
    INST --> ENGINE
    ENGINE --> CONT
    
    SM & SSM --> ENV
    
    CW --> LOGS
    FLOW --> VPC
    
    R53 --> AREC
    AREC --> INST

    classDef network fill:#e4f0f8,stroke:#336
    classDef security fill:#ffe4e4,stroke:#633
    classDef compute fill:#f9eee3,stroke:#663
    classDef application fill:#e3f9e3,stroke:#363
    classDef monitoring fill:#f0e4ff,stroke:#336
    classDef dns fill:#f4f4f4,stroke:#666

    class NET,VPC,PUB,PRIV,ROUTE,NACL network
    class SEC,SG,IAM,SECRETS security
    class COMP,EC2,DOCKER compute
    class APP,CONT,CONF application
    class MON,CW,LOGS,TRAIL,FLOW monitoring
    class DNS,R53,AREC dns

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
