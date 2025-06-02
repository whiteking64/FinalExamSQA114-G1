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
        echo "--- Checking Google Chrome version ---"
        google-chrome --version || chromium-browser --version || chrome --version || echo "Google Chrome not found or command failed"
        echo "------------------------------------"
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
