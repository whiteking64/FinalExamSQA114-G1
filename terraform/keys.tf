resource "tls_private_key" "deployer" {
  algorithm = "RSA"
  rsa_bits  = 2048
}

resource "aws_key_pair" "deployer_key" {
  key_name   = var.key_name
  public_key = tls_private_key.deployer.public_key_openssh
}

output "private_key_pem" {
  value     = tls_private_key.deployer.private_key_pem
  sensitive = true
}
