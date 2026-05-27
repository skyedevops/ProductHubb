# Infrastructure Guide

ProductHubb is deployed on AWS using a modular Terraform setup.

## Deployment Model
- **Network**: VPC with 2 public and 2 private subnets across multiple AZs.
- **Database**: Amazon DocumentDB (MongoDB compatible) located in the private subnets.
- **Compute**: AWS ECS Fargate for both API and Web services.
- **State**: Terraform state is stored in an S3 bucket (`producthubb-terraform-state`).

## Deployment Workflow
1. **Initialize Terraform**:
   ```bash
   cd infra/terraform
   terraform init
   ```
2. **Plan & Apply**:
   ```bash
   terraform plan
   terraform apply
   ```

## CI/CD Pipeline (GitLab)
The pipeline is defined in `.gitlab-ci.yml`:
- **Lint**: Runs `npm run lint` across the monorepo.
- **Build**: Builds both apps via Turborepo and stores artifacts.
- **Deploy Staging**: Triggered on merge to `develop` branch.
- **Deploy Prod**: Manual trigger on `main` branch.
