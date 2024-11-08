## Architecture Diagrams

### Infrastructure Architecture
```mermaid
graph TB
    subgraph NET["1-NETWORK"]
        VPC["NET-001: VPC Configuration<br/>10.0.0.0/16<br/>vpc-01d23652308061554"]
        
        subgraph SUBNETS["NET-100: Subnets"]
            PUB1["NET-101: Public Subnet 1<br/>10.0.1.0/24<br/>sa-east-1a<br/>subnet-068eaefc740f64d7b"]
            PUB2["NET-102: Public Subnet 2<br/>10.0.2.0/24<br/>sa-east-1b<br/>subnet-008663bb78c888cdf"]
        end
        
        subgraph ROUTING["NET-200: Routing"]
            IGW["NET-201: Internet Gateway<br/>igw-038cd76e774743fa7"]
            NAT["NET-202: NAT Gateway<br/>nat-037f24730c0830d01"]
            RT["NET-203: Route Table<br/>rtb-06ae82970acef7c0a"]
            NACL["NET-204: Network ACL<br/>acl-03cd2bdada71b3e93"]
        end
    end

    subgraph SEC["2-SECURITY"]
        subgraph SG["SEC-100: Security Groups"]
            SGAPP["SEC-101: App Security Group<br/>Ports: 80,443<br/>Source: 0.0.0.0/0"]
            SGADM["SEC-102: Admin Security Group<br/>Port: 22<br/>Source: Admin IPs"]
            SGDB["SEC-103: Database Security Group<br/>Port: 5432<br/>Source: App SG"]
        end
        
        subgraph IAM["SEC-200: IAM"]
            ROLES["SEC-201: IAM Roles<br/>EC2 Instance Profile"]
            POLS["SEC-202: IAM Policies<br/>S3, Systems Manager"]
        end
    end

    subgraph COMP["3-COMPUTE"]
        subgraph EC2["COMP-100: EC2 Instance"]
            INST["COMP-101: Twenty Server<br/>t3.medium<br/>Ubuntu 20.04 LTS"]
            EBS["COMP-102: EBS Volume<br/>20GB GP2"]
            DOCKER["COMP-103: Docker Environment"]
        end
    end

    subgraph APP["4-APPLICATION"]
        subgraph CONTAINERS["APP-100: Docker Containers"]
            FRONT["APP-101: Frontend Container<br/>Port: 80"]
            BACK["APP-102: Backend Container<br/>Port: 3000"]
            POSTGRES["APP-103: PostgreSQL Container<br/>Port: 5432"]
        end
        
        subgraph CONFIG["APP-200: Configurations"]
            ENV["APP-201: Environment Variables"]
            COMPOSE["APP-202: Docker Compose File"]
        end
    end

    subgraph DNS["5-DNS"]
        ROUTE53["DNS-001: Route53 Zone<br/>olhai.app.br"]
        RECORD["DNS-002: A Record<br/>mGenialdev.olhai.app.br"]
    end

    %% Relationships
    VPC --> SUBNETS
    SUBNETS --> ROUTING
    IGW --> RT
    NAT --> RT
    RT --> PUB1
    RT --> PUB2
    
    SG --> EC2
    IAM --> EC2
    
    EC2 --> CONTAINERS
    CONTAINERS --> CONFIG
    
    ROUTE53 --> RECORD
    RECORD --> INST

    classDef network fill:#e4f0f8,stroke:#336
    classDef security fill:#ffe4e4,stroke:#633
    classDef compute fill:#f9eee3,stroke:#663
    classDef application fill:#e3f9e3,stroke:#363
    classDef dns fill:#f0e4ff,stroke:#336
    
    class NET,VPC,SUBNETS,ROUTING,PUB1,PUB2,IGW,NAT,RT,NACL network
    class SEC,SG,SGAPP,SGADM,SGDB,IAM,ROLES,POLS security
    class COMP,EC2,INST,EBS,DOCKER compute
    class APP,CONTAINERS,FRONT,BACK,POSTGRES,CONFIG,ENV,COMPOSE application
    class DNS,ROUTE53,RECORD dns
```

### Deployment Workflow
```mermaid
sequenceDiagram
    participant ADM as Administrator
    participant NET as Network Layer
    participant SEC as Security Layer
    participant COMP as Compute Layer
    participant APP as Application Layer
    participant DNS as DNS Layer

    Note over ADM: Deployment Start
    
    %% Network Configuration
    ADM->>NET: NET-001: Create VPC
    NET->>NET: NET-100: Configure Subnets
    NET->>NET: NET-200: Setup Routing
    Note over NET: Network Ready

    %% Security Setup
    ADM->>SEC: SEC-100: Create Security Groups
    ADM->>SEC: SEC-200: Configure IAM
    Note over SEC: Security Ready

    %% Compute Provisioning
    ADM->>COMP: COMP-100: Launch EC2
    COMP->>COMP: COMP-102: Attach EBS
    COMP->>COMP: COMP-103: Setup Docker
    Note over COMP: Instance Ready

    %% Application Deployment
    ADM->>APP: APP-200: Prepare Configs
    APP->>APP: APP-100: Deploy Containers
    Note over APP: Application Ready

    %% DNS Configuration
    ADM->>DNS: DNS-001: Configure Route53
    DNS->>DNS: DNS-002: Create Records
    Note over DNS: DNS Ready

    Note over ADM: Deployment Complete
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
