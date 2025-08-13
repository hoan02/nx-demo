# Hướng dẫn Deploy Nx Module Federation Apps lên MicroK8s

## Tổng quan

Dự án này sử dụng Nx workspace với Module Federation để tạo ra các micro-frontends độc lập:
- **Shell App**: Host application (port 4200) - chứa layout chính và load các remote apps
- **Users App**: Remote application (port 4202) - expose routes cho shell app

## Cấu trúc Deploy

```
├── apps/
│   ├── shell/
│   │   ├── Dockerfile          # Build shell app
│   │   └── nginx.conf          # Nginx config cho shell
│   └── users/
│       ├── Dockerfile          # Build users app
│       └── nginx.conf          # Nginx config cho users
├── k8s/
│   ├── shell-deployment.yaml   # K8s manifests cho shell
│   └── users-deployment.yaml   # K8s manifests cho users
├── Jenkinsfile-shell           # Jenkins pipeline cho shell
├── Jenkinsfile-users           # Jenkins pipeline cho users
└── deploy.sh                   # Script deploy tổng hợp
```

## Cách Deploy

### 1. Deploy bằng Script (Khuyến nghị)

```bash
# Deploy tất cả apps
./deploy.sh all

# Deploy chỉ shell app
./deploy.sh shell

# Deploy chỉ users app
./deploy.sh users
```

### 2. Deploy bằng Jenkins Pipeline

#### Shell App Pipeline
```bash
# Tạo Jenkins job với Jenkinsfile-shell
# Hoặc chạy trực tiếp:
jenkins-jobs update shell-deploy Jenkinsfile-shell
```

#### Users App Pipeline
```bash
# Tạo Jenkins job với Jenkinsfile-users
# Hoặc chạy trực tiếp:
jenkins-jobs update users-deploy Jenkinsfile-users
```

### 3. Deploy thủ công

#### Build và Push Images
```bash
# Build shell app
docker build -f apps/shell/Dockerfile -t registry.container-registry.svc.cluster.local:5000/shell-app:latest .

# Build users app
docker build -f apps/users/Dockerfile -t registry.container-registry.svc.cluster.local:5000/users-app:latest .

# Push images
docker push registry.container-registry.svc.cluster.local:5000/shell-app:latest
docker push registry.container-registry.svc.cluster.local:5000/users-app:latest
```

#### Deploy lên Kubernetes
```bash
# Deploy shell app
kubectl apply -f k8s/shell-deployment.yaml

# Deploy users app
kubectl apply -f k8s/users-deployment.yaml

# Kiểm tra status
kubectl get pods
kubectl get svc
kubectl get ingress
```

## Cấu hình Module Federation

### Shell App (Host)
- Load các remote apps: `products`, `categories`, `users`, `lifecycleHooks`
- Cấu hình trong `apps/shell/module-federation.config.ts`

### Users App (Remote)
- Expose routes: `./Routes`
- Cấu hình trong `apps/users/module-federation.config.ts`

## Truy cập Applications

Sau khi deploy thành công:

- **Shell App**: http://shell.local
- **Users App**: http://users.local

## Health Checks

Cả hai apps đều có health check endpoint:
- Shell: http://shell.local/health
- Users: http://users.local/health

## Troubleshooting

### 1. Kiểm tra Pods
```bash
kubectl get pods -l app=shell-app
kubectl get pods -l app=users-app
```

### 2. Xem logs
```bash
kubectl logs -l app=shell-app
kubectl logs -l app=users-app
```

### 3. Kiểm tra Services
```bash
kubectl get svc shell-service users-service
```

### 4. Kiểm tra Ingress
```bash
kubectl get ingress
kubectl describe ingress shell-ingress
kubectl describe ingress users-ingress
```

### 5. Test connectivity
```bash
# Test shell app
curl -H "Host: shell.local" http://localhost

# Test users app
curl -H "Host: users.local" http://localhost
```

## Cấu hình MicroK8s

### 1. Enable addons cần thiết
```bash
microk8s enable registry
microk8s enable ingress
microk8s enable dns
```

### 2. Cấu hình DNS (nếu cần)
Thêm vào `/etc/hosts`:
```
127.0.0.1 shell.local
127.0.0.1 users.local
```

## Monitoring và Scaling

### 1. Scale apps
```bash
# Scale shell app
kubectl scale deployment shell-app --replicas=3

# Scale users app
kubectl scale deployment users-app --replicas=3
```

### 2. Resource limits
Cả hai apps đều có resource limits:
- CPU: 100m request, 200m limit
- Memory: 128Mi request, 256Mi limit

### 3. Rolling updates
```bash
# Update shell app
kubectl set image deployment/shell-app shell-app=registry.container-registry.svc.cluster.local:5000/shell-app:v2

# Update users app
kubectl set image deployment/users-app users-app=registry.container-registry.svc.cluster.local:5000/users-app:v2
```

## Security Considerations

1. **Registry Security**: Sử dụng `--insecure` và `--skip-tls-verify` cho development
2. **CORS**: Đã cấu hình CORS headers cho Module Federation
3. **Resource Limits**: Đã set resource limits để tránh DoS
4. **Health Checks**: Có liveness và readiness probes

## Performance Optimization

1. **Nginx Caching**: Static files được cache 1 năm
2. **Gzip Compression**: Enabled cho text files
3. **Module Federation**: Chỉ load modules khi cần
4. **Multi-stage Docker**: Giảm image size 