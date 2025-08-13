#!/bin/bash

# Deploy script for Nx Module Federation apps to microk8s
# Usage: ./deploy.sh [shell|users|all]

set -e

# Configuration
REGISTRY="registry.container-registry.svc.cluster.local:5000"
SHELL_IMAGE="${REGISTRY}/shell-app:latest"
USERS_IMAGE="${REGISTRY}/users-app:latest"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

build_and_push() {
    local app_name=$1
    local dockerfile_path=$2
    local image_name=$3
    
    log_info "Building and pushing $app_name..."
    
    # Build with kaniko
    kubectl run kaniko-$app_name --rm --restart=Never \
        --image=gcr.io/kaniko-project/executor:latest \
        --overrides="{
            \"spec\": {
                \"containers\": [{
                    \"name\": \"kaniko\",
                    \"image\": \"gcr.io/kaniko-project/executor:latest\",
                    \"args\": [
                        \"--dockerfile=$dockerfile_path\",
                        \"--context=dir:///workspace/\",
                        \"--destination=$image_name\",
                        \"--insecure\",
                        \"--skip-tls-verify\"
                    ],
                    \"volumeMounts\": [{
                        \"name\": \"workspace\",
                        \"mountPath\": \"/workspace\"
                    }]
                }],
                \"volumes\": [{
                    \"name\": \"workspace\",
                    \"emptyDir\": {}
                }]
            }
        }"
}

deploy_app() {
    local app_name=$1
    local deployment_file=$2
    
    log_info "Deploying $app_name to Kubernetes..."
    
    kubectl apply -f $deployment_file
    kubectl rollout status deployment/$app_name --timeout=300s
    
    log_info "$app_name deployed successfully!"
}

# Main deployment logic
case "${1:-all}" in
    "shell")
        log_info "Deploying Shell app only..."
        build_and_push "shell" "apps/shell/Dockerfile" $SHELL_IMAGE
        deploy_app "shell-app" "k8s/shell-deployment.yaml"
        ;;
    "users")
        log_info "Deploying Users app only..."
        build_and_push "users" "apps/users/Dockerfile" $USERS_IMAGE
        deploy_app "users-app" "k8s/users-deployment.yaml"
        ;;
    "all")
        log_info "Deploying both Shell and Users apps..."
        
        # Build and push both images
        build_and_push "shell" "apps/shell/Dockerfile" $SHELL_IMAGE
        build_and_push "users" "apps/users/Dockerfile" $USERS_IMAGE
        
        # Deploy both apps
        deploy_app "shell-app" "k8s/shell-deployment.yaml"
        deploy_app "users-app" "k8s/users-deployment.yaml"
        
        log_info "All apps deployed successfully!"
        ;;
    *)
        log_error "Usage: $0 [shell|users|all]"
        exit 1
        ;;
esac

# Show deployment status
log_info "Deployment status:"
kubectl get pods -l app=shell-app
kubectl get pods -l app=users-app

log_info "Services:"
kubectl get svc shell-service users-service

log_info "Ingress:"
kubectl get ingress 