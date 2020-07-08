#!/usr/bin/env groovy

pipeline {
  agent { label "mesos" }
  stages {
    stage("Deploy") {
      environment {
        BUCKET = "docs-d2iq-com/staging/"
      }
      steps {
        sh '''
          docker run --rm -it amazon/aws-cli --version
          docker run --rm -it amazon/aws-cli s3 mb s3://$BUCKET
        '''
      }
    }
  }
}
