pipeline {

    agent any

    environment {
        AWS_REGION     = 'us-east-1'
        AWS_ACCOUNT_ID = '565725315365'
        ECR_REGISTRY   = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

        SERVICES = 'ui api-gateway auth-service user-service product-service order-service cart-service notification-service analytics-service search-service'
    }

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    stages {

        // =========================================================
        // STAGE 1 - Checkout Source Code
        // =========================================================
        stage('Checkout') {
            steps {
                echo '========================================='
                echo 'CHECKING OUT CLOUDVERSE SOURCE CODE'
                echo '========================================='

                checkout scm

                sh '''
                    echo "Git Commit:"
                    git rev-parse --short HEAD

                    echo "Current Directory:"
                    pwd

                    echo "Repository Contents:"
                    ls -la
                '''
            }
        }


        // =========================================================
        // STAGE 2 - Verify Required Tools
        // =========================================================
        stage('Verify Tools') {
            steps {
                echo '========================================='
                echo 'VERIFYING REQUIRED TOOLS'
                echo '========================================='

                sh '''
                    set -e

                    echo "Docker:"
                    docker --version

                    echo "AWS CLI:"
                    aws --version

                    echo "Git:"
                    git --version
                '''
            }
        }


        // =========================================================
        // STAGE 3 - Verify AWS Identity
        // =========================================================
        stage('Verify AWS Access') {
            steps {
                echo '========================================='
                echo 'VERIFYING AWS ACCESS'
                echo '========================================='

                sh '''
                    set -e

                    aws sts get-caller-identity
                '''
            }
        }


        // =========================================================
        // STAGE 4 - Login to Amazon ECR
        // =========================================================
        stage('ECR Login') {
            steps {
                echo '========================================='
                echo 'LOGGING INTO AMAZON ECR'
                echo '========================================='

                sh '''
                    set -e

                    aws ecr get-login-password \
                      --region $AWS_REGION | \
                    docker login \
                      --username AWS \
                      --password-stdin $ECR_REGISTRY
                '''
            }
        }


        // =========================================================
        // STAGE 5 - Create ECR Repositories If Missing
        // =========================================================
        stage('Prepare ECR Repositories') {
            steps {
                echo '========================================='
                echo 'CHECKING ECR REPOSITORIES'
                echo '========================================='

                sh '''
                    set -e

                    for SERVICE in $SERVICES
                    do
                        REPOSITORY="cloudverse/$SERVICE"

                        echo "-----------------------------------------"
                        echo "Checking repository: $REPOSITORY"
                        echo "-----------------------------------------"

                        if aws ecr describe-repositories \
                            --repository-names "$REPOSITORY" \
                            --region "$AWS_REGION" \
                            >/dev/null 2>&1
                        then
                            echo "Repository already exists: $REPOSITORY"
                        else
                            echo "Creating repository: $REPOSITORY"

                            aws ecr create-repository \
                              --repository-name "$REPOSITORY" \
                              --region "$AWS_REGION"
                        fi
                    done
                '''
            }
        }


        // =========================================================
        // STAGE 6 - Build Docker Images
        // =========================================================
        stage('Build Docker Images') {
            steps {
                echo '========================================='
                echo 'BUILDING CLOUDVERSE DOCKER IMAGES'
                echo '========================================='

                sh '''
                    set -e

                    for SERVICE in $SERVICES
                    do
                        echo ""
                        echo "========================================="
                        echo "BUILDING: $SERVICE"
                        echo "========================================="

                        docker build \
                          -t "$SERVICE:$BUILD_NUMBER" \
                          "cloudverse/services/$SERVICE"
                    done
                '''
            }
        }


        // =========================================================
        // STAGE 7 - Tag Docker Images for ECR
        // =========================================================
        stage('Tag Docker Images') {
            steps {
                echo '========================================='
                echo 'TAGGING IMAGES FOR ECR'
                echo '========================================='

                sh '''
                    set -e

                    for SERVICE in $SERVICES
                    do
                        echo "Tagging $SERVICE:$BUILD_NUMBER"

                        docker tag \
                          "$SERVICE:$BUILD_NUMBER" \
                          "$ECR_REGISTRY/cloudverse/$SERVICE:$BUILD_NUMBER"
                    done
                '''
            }
        }


        // =========================================================
        // STAGE 8 - Push Images to ECR
        // =========================================================
        stage('Push Images to ECR') {
            steps {
                echo '========================================='
                echo 'PUSHING CLOUDVERSE IMAGES TO ECR'
                echo '========================================='

                sh '''
                    set -e

                    for SERVICE in $SERVICES
                    do
                        echo ""
                        echo "========================================="
                        echo "PUSHING: $SERVICE:$BUILD_NUMBER"
                        echo "========================================="

                        docker push \
                          "$ECR_REGISTRY/cloudverse/$SERVICE:$BUILD_NUMBER"
                    done
                '''
            }
        }


        // =========================================================
        // STAGE 9 - Verify Exact Images in ECR
        // =========================================================
        stage('Verify Images') {
            steps {
                echo '========================================='
                echo 'VERIFYING CLOUDVERSE ECR IMAGES'
                echo '========================================='

                sh '''
                    set -e

                    for SERVICE in $SERVICES
                    do
                        echo ""
                        echo "========================================="
                        echo "VERIFYING: $SERVICE:$BUILD_NUMBER"
                        echo "========================================="

                        aws ecr describe-images \
                          --repository-name "cloudverse/$SERVICE" \
                          --image-ids imageTag="$BUILD_NUMBER" \
                          --region "$AWS_REGION" \
                          --query 'imageDetails[0].[imageDigest,imageTags]' \
                          --output text

                        echo "VERIFIED: $SERVICE:$BUILD_NUMBER"
                    done
                '''
            }
        }


        // =========================================================
        // STAGE 10 - Display Build Summary
        // =========================================================
        stage('Build Summary') {
            steps {
                echo '========================================='
                echo 'CLOUDVERSE BUILD SUMMARY'
                echo '========================================='

                sh '''
                    echo "Jenkins Build Number: $BUILD_NUMBER"
                    echo "AWS Region: $AWS_REGION"
                    echo "ECR Registry: $ECR_REGISTRY"
                    echo ""
                    echo "Images created:"
                    echo ""

                    for SERVICE in $SERVICES
                    do
                        echo "$ECR_REGISTRY/cloudverse/$SERVICE:$BUILD_NUMBER"
                    done
                '''
            }
        }
    }


    // =============================================================
    // POST ACTIONS
    // =============================================================
    post {

        success {
            echo '========================================='
            echo 'CLOUDVERSE BUILD SUCCESSFUL'
            echo '========================================='
            echo 'All Docker images were built and pushed'
            echo 'successfully to Amazon ECR.'
            echo '========================================='
        }

        failure {
            echo '========================================='
            echo 'CLOUDVERSE BUILD FAILED'
            echo 'Check Jenkins Console Output'
            echo '========================================='
        }

        always {
            echo '========================================='
            echo "Jenkins Build: ${BUILD_NUMBER}"
            echo 'PIPELINE FINISHED'
            echo '========================================='
        }
    }
}

