# TwentyCRM Architecture Documentation

## Table of Contents
1. [Infrastructure Overview](#infrastructure-overview)
2. [Component Specifications](#component-specifications)
3. [Network Flow Patterns](#network-flow-patterns)
4. [Monitoring and Backup](#monitoring-and-backup)
5. [Security Configuration](#security-configuration)
6. [Scaling Patterns](#scaling-patterns)
7. [CI/CD Pipeline](#cicd-pipeline)
8. [Failure Recovery](#failure-recovery)
9. [Subsystem Configuration](#subsystem-configuration)

## Infrastructure Overview

```mermaid
graph TB
    %% Global DNS and User Access
    USERS((Internet Users))
    USERS --> DEV_R53 & QA_R53 & PROD_R53

    %% DEVELOPMENT ENVIRONMENT
    subgraph DEV["DEVELOPMENT - mGenialDev.olhai.app.br"]
        DEV_R53["DNS-101: Route53 Zone"] --> DEV_ACM["DNS-102: ACM SSL"]
        DEV_ACM --> DEV_ALB["ALB-101: Load Balancer"]
        
        subgraph DEV_VPC["VPC-101: Dev VPC (10.0.0.0/16)"]
            %% Network Components
            DEV_IGW["NET-101: Internet Gateway"]
            DEV_NAT["NET-102: NAT Gateway"]
            
            subgraph DEV_NET["NET-200: Network"]
                DEV_PUB1["NET-201: Public-1A<br/>10.0.1.0/24"]
                DEV_PUB2["NET-202: Public-1B<br/>10.0.2.0/24"]
                DEV_PRIV1["NET-203: Private-1A<br/>10.0.3.0/24"]
                DEV_PRIV2["NET-204: Private-1B<br/>10.0.4.0/24"]
                
                DEV_RT_PUB["NET-205: Public Routes"]
                DEV_RT_PRIV["NET-206: Private Routes"]
            end

            subgraph DEV_EKS["EKS-100: Dev Cluster v1.27"]
                DEV_CP["EKS-101: Control Plane"]
                
                subgraph DEV_NODES["EKS-200: Node Groups"]
                    DEV_FNG["Frontend Nodes<br/>t3.medium x2<br/>Min: 2, Max: 4"]
                    DEV_BNG["Backend Nodes<br/>t3.large x2<br/>Min: 2, Max: 4"]
                end

                subgraph DEV_K8S["EKS-300: K8s Resources"]
                    DEV_NS["twenty-dev Namespace"]
                    DEV_F_SVC["Frontend Service: 3001"]
                    DEV_B_SVC["Backend Service: 3000"]
                    DEV_CM["ConfigMaps"]
                    DEV_SEC["Secrets"]
                end
            end
            
            subgraph DEV_DB["DB-100: Database"]
                DEV_EC2["EC2 t3.large<br/>Ubuntu 20.04"]
                DEV_PG["PostgreSQL 13<br/>+ pg_graphql<br/>+ uuid-ossp"]
                DEV_VOL["GP3 50GB Volume"]
            end
        end

        subgraph DEV_MONITOR["MON-100: Monitoring"]
            DEV_CW["CloudWatch Logs"]
            DEV_PROM["Prometheus"]
            DEV_GRAF["Grafana"]
            DEV_ALERT["Alerts"]
        end
    end

    %% Style Definitions
    classDef dev fill:#E6F3FF,stroke:#3182CE
    classDef qa fill:#C6F6D5,stroke:#38A169
    classDef prod fill:#FED7D7,stroke:#E53E3E
    classDef security fill:#FEEBC8,stroke:#DD6B20
    classDef monitoring fill:#E9D8FD,stroke:#805AD5

    %% Apply Styles
    class DEV,DEV_VPC,DEV_NET,DEV_EKS,DEV_DB,DEV_MONITOR dev
```

## Component Specifications

```mermaid
graph TB
    subgraph COMPONENT_SPECS["Component Detailed Specifications"]
        subgraph FRONTEND["Frontend Specifications"]
            FE_RESOURCE["Resource Requirements<br/>DEV/QA:<br/>- CPU: 2 vCPU<br/>- Memory: 4GB<br/>PROD:<br/>- CPU: 4 vCPU<br/>- Memory: 8GB"]
            FE_CONFIG["Configuration<br/>- Port: 3001<br/>- Node Version: 16.x<br/>- NPM Memory: 4GB<br/>- Max Old Space: 2GB"]
            FE_HEALTH["Health Checks<br/>- Readiness: /ready<br/>- Liveness: /health<br/>- Period: 10s"]
        end

        subgraph BACKEND["Backend Specifications"]
            BE_RESOURCE["Resource Requirements<br/>DEV/QA:<br/>- CPU: 4 vCPU<br/>- Memory: 8GB<br/>PROD:<br/>- CPU: 8 vCPU<br/>- Memory: 16GB"]
            BE_CONFIG["Configuration<br/>- Port: 3000<br/>- Node Version: 16.x<br/>- Max Connections: 1000<br/>- Body Limit: 10mb"]
            BE_HEALTH["Health Checks<br/>- Readiness: /ready<br/>- Liveness: /health<br/>- DB Check: /dbhealth"]
        end

        subgraph DATABASE["Database Specifications"]
            DB_RESOURCE["Resource Requirements<br/>DEV/QA:<br/>- CPU: 4 vCPU<br/>- Memory: 8GB<br/>PROD:<br/>- CPU: 8 vCPU<br/>- Memory: 16GB"]
            DB_CONFIG["PostgreSQL Config<br/>- Version: 13<br/>- Max Connections: 200<br/>- Shared Buffers: 4GB<br/>- Work Mem: 64MB"]
            DB_STORAGE["Storage Configuration<br/>DEV/QA: 50GB GP3<br/>PROD: 100GB GP3<br/>IOPS: 3000<br/>Throughput: 125MB/s"]
        end
    end

    classDef frontend fill:#E6F3FF,stroke:#3182CE
    classDef backend fill:#C6F6D5,stroke:#38A169
    classDef database fill:#FED7D7,stroke:#E53E3E

    class FRONTEND,FE_RESOURCE,FE_CONFIG,FE_HEALTH frontend
    class BACKEND,BE_RESOURCE,BE_CONFIG,BE_HEALTH backend
    class DATABASE,DB_RESOURCE,DB_CONFIG,DB_STORAGE database
```

[Continue with other diagrams...]

Would you like me to:
1. Continue with the remaining diagrams?
2. Add configuration examples?
3. Add implementation instructions?
4. Add troubleshooting guides?
