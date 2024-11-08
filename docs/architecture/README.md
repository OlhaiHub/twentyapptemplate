## Architecture Diagrams

### Infrastructure Architecture
```mermaid
graph TB
    subgraph EKS["EKS Cluster"]
        CP["Control Plane"]
        
        subgraph FRONTEND["NODE-GROUP-1: Frontend"]
            FN1["Node 1: t3.medium<br/>CPU: 2<br/>RAM: 4GB<br/>Storage: 20GB"]
            FN2["Node 2: t3.medium<br/>CPU: 2<br/>RAM: 4GB<br/>Storage: 20GB"]
            
            subgraph F_PODS["Frontend Pods"]
                FP1["Frontend Pod 1"]
                FP2["Frontend Pod 2"]
            end
        end
        
        subgraph BACKEND["NODE-GROUP-2: Backend"]
            BN1["Node 1: t3.large<br/>CPU: 4<br/>RAM: 8GB<br/>Storage: 30GB"]
            BN2["Node 2: t3.large<br/>CPU: 4<br/>RAM: 8GB<br/>Storage: 30GB"]
            
            subgraph B_PODS["Backend Pods"]
                BP1["Backend Pod 1"]
                BP2["Backend Pod 2"]
            end
        end
        
        subgraph DATABASE["NODE-GROUP-3: Database"]
            DN1["Node 1: t3.xlarge<br/>CPU: 4<br/>RAM: 16GB<br/>Storage: 100GB"]
            
            subgraph D_PODS["Database Pods"]
                DP1["PostgreSQL StatefulSet"]
            end
        end
    end

    %% Taints and Tolerations
    subgraph TAINTS["Node Taints"]
        FT["Frontend Taint:<br/>dedicated=frontend:NoSchedule"]
        BT["Backend Taint:<br/>dedicated=backend:NoSchedule"]
        DT["Database Taint:<br/>dedicated=database:NoSchedule"]
    end

    FT --> FRONTEND
    BT --> BACKEND
    DT --> DATABASE

    classDef cp fill:#326ce5,stroke:#fff,color:#fff
    classDef frontend fill:#00acc1,stroke:#fff,color:#fff
    classDef backend fill:#ab47bc,stroke:#fff,color:#fff
    classDef database fill:#ff7043,stroke:#fff,color:#fff
    classDef taints fill:#78909c,stroke:#fff,color:#fff

    class CP cp
    class FRONTEND,FN1,FN2,F_PODS frontend
    class BACKEND,BN1,BN2,B_PODS backend
    class DATABASE,DN1,D_PODS database
    class TAINTS,FT,BT,DT taints
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
