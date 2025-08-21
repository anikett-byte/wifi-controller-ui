pipeline {
    agent any

    environment {
        IMAGE_NAME = "wifi-controller-ui"
        IMAGE_TAG = "latest"
        DOCKERHUB_USER = "anikettevare"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/anikett-byte/wifi-controller-ui.git'
            }
        }

        stage('Build Angular App with Docker') {
            steps {
                script {
                    sh 'docker build -t ${DOCKERHUB_USER}/${IMAGE_NAME}:${IMAGE_TAG} .'
                }
            }
        }

        stage('Push to DockerHub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh 'docker push ${DOCKERHUB_USER}/${IMAGE_NAME}:${IMAGE_TAG}'
                }
            }
        }

        stage('Deploy on Server') {
            steps {
                sshagent(['server-ssh']) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no -p 10922 aniket@10.80.80.20 '
                        docker pull ${DOCKERHUB_USER}/${IMAGE_NAME}:${IMAGE_TAG} &&
                        docker stop wifi-ui || true &&
                        docker rm wifi-ui || true &&
                        docker run -d --name wifi-ui -p 8082:80 ${DOCKERHUB_USER}/${IMAGE_NAME}:${IMAGE_TAG}
                    '
                    '''
                }
            }
        }
    }
}
