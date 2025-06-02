resource "aws_lb" "prod_alb" {
  name               = "prod-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.allow_ssh_http.id]
  subnets            = [aws_subnet.main_a.id, aws_subnet.main_b.id]

  tags = {
    Name = "prod-alb"
  }
}

resource "aws_lb_target_group" "prod_tg" {
  name     = "prod-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id

  health_check {
    path                = "/"
    protocol            = "HTTP"
    matcher             = "200"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 5
    unhealthy_threshold = 2
  }

  tags = {
    Name = "prod-tg"
  }
}

resource "aws_lb_target_group_attachment" "prod1" {
  target_group_arn = aws_lb_target_group.prod_tg.arn
  target_id        = aws_instance.prod1.id
  port             = 80
}

resource "aws_lb_target_group_attachment" "prod2" {
  target_group_arn = aws_lb_target_group.prod_tg.arn
  target_id        = aws_instance.prod2.id
  port             = 80
}

resource "aws_lb_listener" "prod_listener" {
  load_balancer_arn = aws_lb.prod_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.prod_tg.arn
  }
}
