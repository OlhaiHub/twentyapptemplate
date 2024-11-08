# TwentyCRM Development Environment Setup
[![AWS](https://img.shields.io/badge/AWS-Deployment-orange)](https://aws.amazon.com/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-blue)](https://www.docker.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)](https://www.postgresql.org/)

## Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Infrastructure Details](#infrastructure-details)
- [Network Configuration](#network-configuration)
- [Deployment Script](#deployment-script)
- [Manual Setup Steps](#manual-setup-steps)
- [Monitoring and Maintenance](#monitoring-and-maintenance)
- [Troubleshooting](#troubleshooting)

## Overview
This repository contains deployment scripts and documentation for setting up TwentyCRM in a development environment on AWS. The setup utilizes EC2 for hosting and includes all necessary configurations for running the application in a Docker-based environment.

## Prerequisites

### Required Tools
- AWS CLI installed and configured
- SSH client for connecting to EC2
- Docker and Docker Compose (automatically installed by script)

### AWS Account Requirements
- AWS Account with appropriate permissions
- Access to VPC, EC2, Route53 services
- IAM user with programmatic access

### Network Requirements
The following network resources should be pre-configured:

#### VPC Configuration
- VPC ID: vpc-01d23652308061554
- CIDR Block: 10.0.0.0/16

#### Subnets
Public Subnets:
- subnet-008663bb78c888cdf (10.0.2.0/24, sa-east-1b)
- subnet-068eaefc740f64d7b (10.0.1.0/24, sa-east-1a)

#### Route Tables
- Route Table ID: rtb-06ae82970acef7c0a
- Internet Gateway: igw-038cd76e774743fa7

#### NAT Gateway
- NAT Gateway ID: nat-037f24730c0830d01

#### Network ACL
- ACL ID: acl-03cd2bdada71b3e93
- Allows all traffic (inbound/outbound)

## Infrastructure Details

### EC2 Instance Specifications
- Instance Type: t3.medium
- vCPUs: 2
- Memory: 4 GB RAM
- Storage: 20 GB GP2 EBS
- Operating System: Ubuntu 20.04 LTS
- AMI ID: ami-0af6e9042ea5a4e3e (sa-east-1 region)

### Security Group Configuration
The deployment creates a security group with the following rules:

Inbound Rules:
- Port 22 (SSH): 0.0.0.0/0
- Port 80 (HTTP): 0.0.0.0/0
- Port 443 (HTTPS): 0.0.0.0/0
- Port 5432 (PostgreSQL): 10.0.0.0/16

### DNS Configuration
- Domain: mGenialdev.olhai.app.br
- Hosted Zone: olhai.app.br
- Record Type: A Record (pointing to EC2 public IP)

## Deployment Script
The deployment script (`deploy-twenty-dev.sh`) automates the following processes:

1. Security Group Creation
2. EC2 Instance Launch
3. Software Installation
4. Application Setup
5. DNS Configuration

### Usage
```bash
# Make script executable
chmod +x deploy-twenty-dev.sh

# Run deployment script
./deploy-twenty-dev.sh
```

### Environment Variables
The script uses the following default configurations that can be modified:
```bash
INSTANCE_TYPE="t3.medium"
VOLUME_SIZE="20"
DOMAIN="mGenialdev.olhai.app.br"
PG_DATABASE="twentydb"
PG_USER="twenty"
PG_PASSWORD="twenty"
```

## Manual Setup Steps

### 1. Clone Repository
```bash
git clone https://github.com/twentyhq/twenty.git
cd twenty
```

### 2. Configure Environment
Create a `.env` file with the following configurations:
```env
# Database Configuration
POSTGRES_DB=twentydb
POSTGRES_USER=twenty
POSTGRES_PASSWORD=twenty

# Application URLs
FRONT_URL=http://mGenialdev.olhai.app.br
BACK_URL=http://mGenialdev.olhai.app.br

# JWT Configuration
JWT_SECRET=<generated-secret>
REFRESH_TOKEN_SECRET=<generated-secret>

# Storage Configuration
STORAGE_TYPE=local
PORT=3000
```

### 3. Start Application
```bash
docker-compose -f docker-compose.yml up -d
```

## Monitoring and Maintenance

### Check Application Status
```bash
# View running containers
docker ps

# Check container logs
docker-compose logs -f

# Monitor resource usage
docker stats
```

### Access EC2 Instance
```bash
ssh ubuntu@<instance-ip>
```

### Database Management
```bash
# Connect to PostgreSQL
docker exec -it <postgres-container-id> psql -U twenty twentydb

# Backup database
docker exec <postgres-container-id> pg_dump -U twenty twentydb > backup.sql
```

## Troubleshooting

### Common Issues and Solutions

1. Container Startup Issues
```bash
# Restart containers
docker-compose down
docker-compose up -d

# Check logs
docker-compose logs -f
```

2. Database Connection Issues
```bash
# Verify PostgreSQL is running
docker ps | grep postgres

# Check PostgreSQL logs
docker-compose logs postgres
```

3. Network Issues
```bash
# Check security group rules
aws ec2 describe-security-groups --group-ids <security-group-id>

# Verify DNS resolution
nslookup mGenialdev.olhai.app.br
```

### Health Checks
1. EC2 Instance Status
```bash
aws ec2 describe-instance-status --instance-ids <instance-id>
```

2. Application Health
```bash
curl http://mGenialdev.olhai.app.br/health
```

## Additional Resources

### AWS Resources
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [AWS VPC Documentation](https://docs.aws.amazon.com/vpc/)
- [AWS Route53 Documentation](https://docs.aws.amazon.com/route53/)

### Application Resources
- [Twenty CRM Documentation](https://twenty.com/developers)
- [Docker Documentation](https://docs.docker.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---
## Contributing
Feel free to submit issues and enhancement requests.

## License
This project is licensed under the terms specified in the Twenty CRM repository.

---
**Note**: This deployment is configured for development purposes. For production environments, additional security measures and optimizations should be implemented.
