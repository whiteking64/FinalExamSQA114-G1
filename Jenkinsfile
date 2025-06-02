pipeline {
  agent any

  environment {
    SSH_KEY = credentials('ssh-prod-key')
    TESTING_IP = '100.26.186.215'
    STAGING_IP = '44.203.36.45'
    PROD1_IP   = '18.212.192.140'
    PROD2_IP   = '54.167.88.246'
  }

  stages {
    stage('Clone Repo') {
      steps {
        git url: 'https://github.com/whiteking64/FinalExamSQA114-G1.git', branch: 'main'
      }
    }

    stage('Setup Agent Environment') {
      steps {
        sh '''
        echo "--- Ensuring Google Chrome is installed on agent ---"
        if ! google-chrome --version > /dev/null 2>&1; then
          echo "Google Chrome not found, attempting installation..."
          # Add Google Chrome repo
          sudo tee /etc/yum.repos.d/google-chrome.repo <<EOF
[google-chrome]
name=google-chrome
baseurl=http://dl.google.com/linux/chrome/rpm/stable/x86_64
enabled=1
gpgcheck=1
gpgkey=https://dl.google.com/linux/linux_signing_key.pub
EOF
          # Install Google Chrome
          echo "Installing Google Chrome..."
          sudo yum install -y google-chrome-stable
        else
          echo "Google Chrome is already installed."
        fi
        echo "Verifying Chrome installation:"
        google-chrome --version || echo "Failed to verify Chrome version after setup attempt."
        echo "---------------------------------------------------"
        '''
      }
    }

    stage('Deploy to Testing') {
      steps {
        sh '''
        ssh -oStrictHostKeyChecking=no -i "$SSH_KEY" ec2-user@$TESTING_IP "sudo rm -rf /var/www/html/*"
        scp -i "$SSH_KEY" index.html js.js style.css ec2-user@$TESTING_IP:/tmp/
        ssh -i "$SSH_KEY" ec2-user@$TESTING_IP "sudo mv /tmp/* /var/www/html/"
        '''
      }
    }

    stage('Run Selenium Test') {
      steps {
        sh '''
        export TESTING_URL=http://$TESTING_IP
        npm install selenium-webdriver
        node tic_tac_toe_test.js
        '''
      }
    }

    stage('Deploy to Staging') {
      when {
        expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
      }
      steps {
        sh '''
        ssh -oStrictHostKeyChecking=no -i "$SSH_KEY" ec2-user@$STAGING_IP "sudo rm -rf /var/www/html/*"
        scp -i "$SSH_KEY" index.html js.js style.css ec2-user@$STAGING_IP:/tmp/
        ssh -i "$SSH_KEY" ec2-user@$STAGING_IP "sudo mv /tmp/* /var/www/html/"
        '''
      }
    }

    stage('Deploy to Production') {
      when {
        expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
      }
      steps {
        sh '''
        for IP in $PROD1_IP $PROD2_IP; do
          ssh -oStrictHostKeyChecking=no -i "$SSH_KEY" ec2-user@$IP "sudo rm -rf /var/www/html/*"
          scp -i "$SSH_KEY" index.html js.js style.css ec2-user@$IP:/tmp/
          ssh -i "$SSH_KEY" ec2-user@$IP "sudo mv /tmp/* /var/www/html/"
        done
        '''
      }
    }
  }
}
