## Architecture Diagrams

### Infrastructure Architecture
```mermaid
graph TB
    subgraph AWS_Cloud["AWS Cloud"]
        subgraph VPC["VPC (10.0.0.0/16)"]
            subgraph PublicSubnets["Public Subnets"]
                PS1["subnet-068eaefc740f64d7b\n10.0.1.0/24\nsa-east-1a"]
                PS2["subnet-008663bb78c888cdf\n10.0.2.0/24\nsa-east-1b"]
            end
            
            subgraph EC2["EC2 Instance (t3.medium)"]
                APP["TwentyCRM Application\nDocker Containers"]
                PG["PostgreSQL\nContainer"]
            end
            
            subgraph Network["Network Components"]
                IGW["Internet Gateway\nigw-038cd76e774743fa7"]
                NAT["NAT Gateway\nnat-037f24730c0830d01"]
                RT["Route Table\nrtb-06ae82970acef7c0a"]
                NACL["Network ACL\nacl-03cd2bdada71b3e93"]
            end
        end
        
        subgraph Security["Security"]
            SG["Security Group"]
            SG -->|Allow| HTTP[("Port 80\nHTTP")]
            SG -->|Allow| HTTPS[("Port 443\nHTTPS")]
            SG -->|Allow| SSH[("Port 22\nSSH")]
            SG -->|Allow| POSTGRES[("Port 5432\nPostgreSQL")]
        end
        
        subgraph DNS["Route 53"]
            R53["Hosted Zone\nolhai.app.br"]
            DOMAIN["mGenialdev.olhai.app.br"]
        end
    end
    
    INTERNET((Internet)) --> IGW
    IGW --> RT
    RT --> PublicSubnets
    PublicSubnets --> EC2
    EC2 --> SG
    DOMAIN --> EC2

    classDef vpc fill:#e4f0f8,stroke:#336
    classDef subnet fill:#f4f4f4,stroke:#666
    classDef ec2 fill:#f9eee3,stroke:#663
    classDef network fill:#e3f9e3,stroke:#363
    classDef security fill:#ffe4e4,stroke:#633
    classDef dns fill:#f0e4ff,stroke:#336
    
    class VPC vpc
    class PublicSubnets,PS1,PS2 subnet
    class EC2,APP,PG ec2
    class Network,IGW,NAT,RT,NACL network
    class Security,SG security
    class DNS,R53,DOMAIN dns

### Deployment Workflow
```mermaid
[Second Mermaid Diagram Above]
```
sequenceDiagram
    participant U as User
    participant AWS as AWS CLI
    participant EC2 as EC2 Instance
    participant D as Docker
    participant R53 as Route 53

    U->>AWS: Run deployment script
    AWS->>AWS: Create Security Group
    Note over AWS: Configure inbound rules<br/>for ports 22, 80, 443, 5432
    
    AWS->>EC2: Launch t3.medium instance
    Note over EC2: Ubuntu 20.04 LTS<br/>20GB GP2 Storage
    
    EC2->>EC2: Run user-data script
    Note over EC2: Update system<br/>Install dependencies
    
    EC2->>D: Install Docker & Docker Compose
    
    EC2->>EC2: Clone Twenty repository
    EC2->>EC2: Create .env file
    
    D->>D: Pull required images
    D->>D: Start containers
    Note over D: PostgreSQL<br/>Application containers
    
    AWS->>R53: Update DNS record
    Note over R53: Point mGenialdev.olhai.app.br<br/>to EC2 public IP
    
    R53-->>U: DNS propagation complete
    EC2-->>U: Application ready

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
