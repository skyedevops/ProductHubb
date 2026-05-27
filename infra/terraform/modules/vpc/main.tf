variable "vpc_cidr" { type = string }
variable "public_subnets" { type = list(string) }
variable "private_subnets" { type = list(string) }

resource "aws_vpc" "main" {
  cidr_block = var.vpc_cidr
  tags = { Name = "producthubb-vpc" }
}

resource "aws_subnet" "public" {
  count = length(var.public_subnets)
  vpc_id = aws_vpc.main.id
  cidr_block = var.public_subnets[count.index]
  tags = { Name = "producthubb-public-${count.index}" }
}

resource "aws_subnet" "private" {
  count = length(var.private_subnets)
  vpc_id = aws_vpc.main.id
  cidr_block = var.private_subnets[count.index]
  tags = { Name = "producthubb-private-${count.index}" }
}

output "vpc_id" { value = aws_vpc.main.id }
output "private_subnets" { value = [for s in aws_subnet.private : s.id] }
