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
                // REMPLACE 'backend' par le nom exact de ton dossier
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Tests Jest') {
            steps {
                dir('backend') {
                    // On utilise 'npm run test' pour être sûr
                    sh 'npm run test'
                }
            }
        }
    }

    post {
        success { echo "✅ Succès ! " }
        failure { echo "❌ Échec. Build KO" }
    }
}