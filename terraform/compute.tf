# Jenkins Controller
resource "aws_instance" "jenkins_controller" {
  ami                    = var.ami
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.main_a.id
  key_name               = aws_key_pair.deployer_key.key_name
  vpc_security_group_ids = [aws_security_group.allow_ssh_http.id]
  tags = {
    Name = "jenkins-controller"
    Role = "Jenkins"
  }

  user_data = <<-EOF
              #!/bin/bash
              yum update -y
              yum install -y java-21-amazon-corretto git nodejs npm wget
              wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat/jenkins.repo
              rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io-2023.key
              yum install -y jenkins
              systemctl enable jenkins
              systemctl start jenkins
              fallocate -l 1G /swapfile
              chmod 600 /swapfile
              mkswap /swapfile && swapon /swapfile
              mount -o remount,size=5G /tmp
              EOF
}

# Jenkins Permanent Agent
resource "aws_instance" "jenkins_permanent_agent" {
  ami                    = var.ami
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.main_a.id
  key_name               = aws_key_pair.deployer_key.key_name
  vpc_security_group_ids = [aws_security_group.allow_ssh_http.id]
  tags = {
    Name = "jenkins-permanent-agent"
    Role = "JenkinsAgent"
  }

  user_data = <<-EOF
              #!/bin/bash
              yum update -y
              yum install -y java-21-amazon-corretto
              fallocate -l 1G /swapfile
              chmod 600 /swapfile
              mkswap /swapfile && swapon /swapfile
              mount -o remount,size=5G /tmp
              EOF
}

# Jenkins Dynamic Agent
resource "aws_instance" "jenkins_dynamic_agent" {
  ami                    = var.ami
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.main_a.id
  key_name               = aws_key_pair.deployer_key.key_name
  vpc_security_group_ids = [aws_security_group.allow_ssh_http.id]
  tags = {
    Name = "jenkins-dynamic-agent"
    Role = "JenkinsAgent"
  }

  user_data = <<-EOF
              #!/bin/bash
              yum update -y
              yum install -y java-21-amazon-corretto
              fallocate -l 1G /swapfile
              chmod 600 /swapfile
              mkswap /swapfile && swapon /swapfile
              mount -o remount,size=5G /tmp
              EOF
}

# Testing Environment
resource "aws_instance" "testing_env" {
  ami                    = var.ami
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.main_a.id
  key_name               = aws_key_pair.deployer_key.key_name
  vpc_security_group_ids = [aws_security_group.allow_ssh_http.id]
  tags = {
    Name = "testing-env"
    Role = "AppTesting"
  }

  user_data = <<-EOF
              #!/bin/bash
              yum update -y
              yum install -y httpd git nodejs npm
              systemctl start httpd
              systemctl enable httpd
              EOF
}

# Staging Environment
resource "aws_instance" "staging_env" {
  ami                    = var.ami
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.main_a.id
  key_name               = aws_key_pair.deployer_key.key_name
  vpc_security_group_ids = [aws_security_group.allow_ssh_http.id]
  tags = {
    Name = "staging-env"
    Role = "AppStaging"
  }

  user_data = <<-EOF
              #!/bin/bash
              yum update -y
              yum install -y httpd git nodejs npm
              systemctl start httpd
              systemctl enable httpd
              EOF
}

# Production Server 1
resource "aws_instance" "prod1" {
  ami                    = var.ami
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.main_a.id
  key_name               = aws_key_pair.deployer_key.key_name
  vpc_security_group_ids = [aws_security_group.allow_ssh_http.id]
  tags = {
    Name = "prod-server-1"
    Role = "AppProd"
  }

  user_data = <<-EOF
              #!/bin/bash
              yum update -y
              yum install -y httpd
              systemctl start httpd
              echo "Hello from Production Server 1" > /var/www/html/index.html
              EOF
}

# Production Server 2
resource "aws_instance" "prod2" {
  ami                    = var.ami
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.main_b.id
  key_name               = aws_key_pair.deployer_key.key_name
  vpc_security_group_ids = [aws_security_group.allow_ssh_http.id]
  tags = {
    Name = "prod-server-2"
    Role = "AppProd"
  }

  user_data = <<-EOF
              #!/bin/bash
              yum update -y
              yum install -y httpd
              systemctl start httpd
              echo "Hello from Production Server 2" > /var/www/html/index.html
              EOF
}
