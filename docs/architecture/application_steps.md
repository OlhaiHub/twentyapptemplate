```
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

```
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
