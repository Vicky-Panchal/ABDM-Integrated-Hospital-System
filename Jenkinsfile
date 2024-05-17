pipeline {
    agent any
    tools {nodejs "nodejs"}
    environment {
        FRONTEND_IMAGE_NAME = 'abdm-frontend'
        BACKEND_IMAGE_NAME = 'abdm-backend'
        GITHUB_REPO_URL = 'git@github.com:Vicky-Panchal/ABDM-Integrated-Hospital-System.git'
        DOCKERHUB_CREDENTIALS = credentials('DockerHubCred')
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    // Checkout the code from the GitHub repository
                    git branch: 'development', url: "${GITHUB_REPO_URL}"
                }
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                sh '''
                cd frontend
                docker build -t vickypanchal/${FRONTEND_IMAGE_NAME} -f Dockerfile.dev .
                '''
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                sh '''
                cd backend
                mvn package -DskipTests
                docker build -t vickypanchal/${BACKEND_IMAGE_NAME} .
                '''
            }
        }

    //     stage('Test Frontend') {
    //          steps {
    //             dir('frontend') {
    //             sh 'npm install'
    //             sh 'npm test'
    //         }
    //     }
    // }


        stage('Push Frontend Docker Image') {
            steps {
                script {
                    docker.withRegistry('', 'DockerHubCred') {
                        sh 'docker tag vickypanchal/${FRONTEND_IMAGE_NAME}:latest vickypanchal/${FRONTEND_IMAGE_NAME}:latest'
                        sh 'docker push vickypanchal/${FRONTEND_IMAGE_NAME}:latest'
                    }
                }
            }
        }

        stage('Push Backend Docker Image') {
            steps {
                script {
                    docker.withRegistry('', 'DockerHubCred') {
                        sh 'docker tag vickypanchal/${BACKEND_IMAGE_NAME}:latest vickypanchal/${BACKEND_IMAGE_NAME}:latest'
                        sh 'docker push vickypanchal/${BACKEND_IMAGE_NAME}:latest'
                    }
                }
            }
        }

        stage("Ansible Deploy cluster"){
            steps{
                ansiblePlaybook(
                    colorized: true,
                    disableHostKeyChecking: true,
                    inventory: 'ansible-deploy/inventory',
                    playbook: 'ansible-deploy/playbook.yaml',
                    sudoUser: 'vicky'
                )
            }
        }
    }
}