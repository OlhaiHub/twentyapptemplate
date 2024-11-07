# HubGenial App Template Guide

## What's Included
- Basic GitHub Actions CI workflow (reference ci.yml lines 1-24)
- Issue templates
- PR templates
- Architecture documentation structure

## How to Use This Template

### 1. Create New Repository 

bash
gh repo create hubgenial/new-project --template hubgenial/hubgenial-app-repo-template

### 2. Required Updates
1. Update CI workflow:
   - Replace placeholder steps with actual build/test commands
   - Add necessary environment setup
   - Configure deployment if needed

2. Update Architecture Docs:
   - Document your tech stack
   - Define deployment strategy
   - Outline security measures

### 3. Optional Features
- Frontend setup (Next.js)
- Backend setup (Node.js)
- Database configurations
- Docker setup

## Template Structure

hubgenial-app-repo-template/
├── .github/
│ ├── workflows/
│ │ └── ci.yml # Basic CI pipeline
│ ├── ISSUE_TEMPLATE/ # Bug & feature templates
│ └── PULL_REQUEST_TEMPLATE.md
├── docs/ # Add your docs here
└── architecture/ # Architecture decisions

## Common Customizations
1. CI Pipeline:
   - Add language-specific setup
   - Configure caching
   - Add deployment steps

2. Branch Protection:
   - Enable required reviews
   - Enable status checks
   - Lock main branch

3. Environment Secrets:
   - AWS credentials
   - API keys
   - Database URLs