variable "vpc_id" { type = string }
variable "private_subnets" { type = list(string) }

resource "aws_docdb_cluster" "main" {
  cluster_identifier      = "producthubb-cluster"
  engine                  = "docdb"
  master_username        = "admin"
  master_password        = "secure-password-change-me"
  allocated_iops         = 0
  ca_cert_identifier     = "cluster-ca-2019-09"
  db_cluster_volume_size = 20
  vpc_security_group_ids  = [aws_security_group.db_sg.id]
  subnet_group_name       = aws_docdb_subnet_group.main.name
  skip_final_snapshot    = true
}

resource "aws_docdb_cluster_instance" "instance" {
  identifier      = "producthubb-instance-1"
  cluster_identifier = aws_docdb_cluster.main.id
  engine          = "docdb"
}

resource "aws_docdb_subnet_group" "main" {
  name       = "producthubb-db-subnet-group"
  subnet_ids = var.private_subnets
}

resource "aws_security_group" "db_sg" {
  name        = "producthubb-db-sg"
  vpc_id      = var.vpc_id
  ingress {
    from_port   = 27017
    to_port     = 27017
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }
}

output "endpoint" { value = aws_docdb_cluster.main.endpoint }
