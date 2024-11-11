## Architecture Diagrams

### Infrastructure Architecture
```mermaid
raph TB
    subgraph "Source Repositories"
        subgraph "Application Code"
            TWENTY_REPO["twentyhq/twenty<br/>Upstream Twenty CRM<br/>Base Application"]
            MGENIAL_REPO["olhai-hubgenial/mgenial<br/>Custom mGenial Code<br/>- UI/UX Customizations<br/>- Branding<br/>- Custom Features<br/>- Integration Logic"]
            
            TWENTY_REPO -.->|Fork/Reference| MGENIAL_REPO
        end

        subgraph "Infrastructure Code"
            INFRA_REPO["olhai-hubgenial/mgenial-infra<br/>Infrastructure as Code"]
            
            subgraph "Repository Structure"
                TERRAFORM["terraform/<br/>- environments/<br/>- modules/<br/>- main.tf"]
                K8S["kubernetes/<br/>- deployments/<br/>- services/<br/>- configs/"]
            end
        end
    end

    subgraph "CI/CD Pipelines"
        MGENIAL_CI["mGenial Build Pipeline<br/>- Merge Upstream Changes<br/>- Apply Customizations<br/>- Build Custom Images<br/>- Run Tests"]
        INFRA_CI["Infrastructure Pipeline<br/>- Terraform Plan/Apply<br/>- K8s Deployments"]
        
        MGENIAL_REPO --> MGENIAL_CI
        INFRA_REPO --> INFRA_CI
    end

    subgraph "Artifact Storage"
        S3["S3 State Storage<br/>olhai-hubgenial-terraform-state"]
        DYNAMO["DynamoDB Locks<br/>olhai-hubgenial-terraform-locks"]
        ECR["Amazon ECR<br/>mgenial-images"]
    end

    subgraph "AWS Infrastructure"
        subgraph "DEV-VPC-101 (10.0.0.0/16)"
            DEV_R53["DNS-101<br/>mGenialDev.olhai.app.br"]
            DEV_ALB["ALB-101"]
            DEV_EKS["EKS-100<br/>mGenial Pods:<br/>Frontend: t3.medium x2<br/>Backend: t3.large x2"]
            DEV_DB_ASG["DB-100: ASG<br/>EC2: t3.large<br/>Postgres 13<br/>GP3 50GB"]
        end
        
        subgraph "QA-VPC-201 (10.1.0.0/16)"
            QA_R53["DNS-201<br/>mGenialQA.olhai.app.br"]
            QA_ALB["ALB-201"]
            QA_EKS["EKS-400<br/>mGenial Pods:<br/>Frontend: t3.medium x2<br/>Backend: t3.large x2"]
            QA_DB_ASG["DB-200: ASG<br/>EC2: t3.large<br/>Postgres 13<br/>GP3 50GB"]
        end
        
        subgraph "PROD-VPC-301 (10.2.0.0/16)"
            PROD_R53["DNS-301<br/>mGenial.olhai.app.br"]
            PROD_ALB["ALB-301"]
            PROD_EKS["EKS-700<br/>mGenial Pods:<br/>Frontend: t3.large x3<br/>Backend: t3.xlarge x3"]
            PROD_DB_ASG["DB-300: ASG<br/>EC2: t3.xlarge<br/>Postgres 13<br/>GP3 100GB"]
        end
    end

    %% Application Flow
    MGENIAL_CI -->|Push Custom Images| ECR
    ECR -->|Pull mGenial Images| DEV_EKS
    ECR -->|Pull mGenial Images| QA_EKS
    ECR -->|Pull mGenial Images| PROD_EKS

    %% Infrastructure Flow
    INFRA_CI -->|Manage State| S3
    INFRA_CI -->|Lock State| DYNAMO
    S3 -->|Current State| DEV_EKS & QA_EKS & PROD_EKS
    S3 -->|Current State| DEV_DB_ASG & QA_DB_ASG & PROD_DB_ASG

    %% High contrast theme
    classDef default fill:#1a1a1a,stroke:#fff,stroke-width:2px,color:#fff
    classDef github fill:#2d333b,stroke:#fff,stroke-width:2px,color:#fff
    classDef mgenial fill:#4d1f1f,stroke:#fff,stroke-width:3px,color:#fff
    classDef state fill:#3d1f1f,stroke:#fff,stroke-width:2px,color:#fff
    classDef dev fill:#1f3d1f,stroke:#fff,stroke-width:2px,color:#fff
    classDef qa fill:#1f1f3d,stroke:#fff,stroke-width:2px,color:#fff
    classDef prod fill:#3d1f3d,stroke:#fff,stroke-width:2px,color:#fff

    class TWENTY_REPO github
    class MGENIAL_REPO,MGENIAL_CI mgenial
    class INFRA_REPO,TERRAFORM,K8S github
    class S3,DYNAMO,ECR state
    class DEV_R53,DEV_ALB,DEV_EKS,DEV_DB_ASG dev
    class QA_R53,QA_ALB,QA_EKS,QA_DB_ASG qa
    class PROD_R53,PROD_ALB,PROD_EKS,PROD_DB_ASG prod
```


