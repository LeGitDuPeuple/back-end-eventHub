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
                // Si ton code est dans un dossier 'back', laisse dir('back'). 
                // Sinon, enlève la ligne dir et l'accolade correspondante.
                dir('back') {
                    sh 'npm install'
                }
            }
        }

        stage('Tests Jest') {
            steps {
                dir('back') {
                    sh 'npm test'
                }
            }
        }
    }

    post {
        success {
            echo "✅ Succès : Les tests sont passés !"
        }
        failure {
            echo "❌ Échec : Les tests ont échoué."
        }
    }
}