pipeline {
    agent any

    tools {
        nodejs 'Node-20'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Tests Jest') {
            steps {
                dir('backend') {
                    sh 'npm run test'
                }
            }
        }
    }

    post {
        success { echo "✅ Succès #test" }
        failure { echo "❌ Échec. Build KO..." }
    }
}