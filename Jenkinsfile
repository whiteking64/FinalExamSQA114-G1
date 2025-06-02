pipeline {
  agent any

  environment {
    SSH_KEY = credentials('ssh-prod-key')
    TESTING_IP = 'REPLACE_WITH_TESTING_IP'
    STAGING_IP = 'REPLACE_WITH_STAGING_IP'
    PROD1_IP = 'REPLACE_WITH_PROD1_IP'
    PROD2_IP = 'REPLACE_WITH_PROD2_IP'
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
