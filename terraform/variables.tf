variable "region" {
  default = "us-east-1"
}

variable "ami" {
  default = "ami-0440d3b780d96b29d"  # Amazon Linux 2023
}

variable "instance_type" {
  default = "t2.micro"
}

variable "key_name" {
  default = "deployer_key"
}
