variable "vpc_id" { type = string }
variable "private_subnets" { type = list(string) }
variable "db_endpoint" { type = string }

resource "aws_ecs_cluster" "main" {
  name = "producthubb-cluster"
}

# This is a simplified mock for an ECS setup with Fargate
resource "aws_ecs_task_definition" "api" {
  family                   = "producthubb-api"
  cpu                      = "256"
  memory                   = "512"
  network_mode            = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  container_definitions    = jsonencode([
    {
      name  = "api"
      image = "producthubb-api:latest"
      portMappings = [{ containerPort = 3001, hostPort = 3001 }]
      environment = [
        { name = "MONGODB_URI", value = var.db_endpoint },
        { name = "JWT_SECRET", value = "prod-secret" }
      ]
    }
  ])
}

resource "aws_ecs_task_definition" "web" {
  family                   = "producthubb-web"
  cpu                      = "256"
  memory                   = "512"
  network_mode            = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  container_definitions    = jsonencode([
    {
      name  = "web"
      image = "producthubb-web:latest"
      portMappings = [{ containerPort = 3000, hostPort = 3000 }]
      environment = [
        { name = "NEXT_PUBLIC_API_URL", value = "http://api.producthubb.com/api" }
      ]
    }
  ])
}

output "api_url" { value = "http://api.producthubb.com" }
output "web_url" { value = "http://web.producthubb.com" }
