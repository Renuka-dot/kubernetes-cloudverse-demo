# ───────────────────────────────────────────────────────────────────────────
# STEP 9 — Build, Tag and Push All Images
# ───────────────────────────────────────────────────────────────────────────

export AWS_ACCOUNT_ID=865189140490

# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login \
  --username AWS \
  --password-stdin 865189140490.dkr.ecr.us-east-1.amazonaws.com


# 🖥️ UI Service
docker build -t cloudverse-ui ./services/ui

docker tag cloudverse-ui:latest \
865189140490.dkr.ecr.us-east-1.amazonaws.com/cloudverse/ui-service:v1

docker push \
865189140490.dkr.ecr.us-east-1.amazonaws.com/cloudverse/ui-service:v1


# 🔀 API Gateway
docker build -t cloudverse-api-gateway ./services/api-gateway

docker tag cloudverse-api-gateway:latest \
865189140490.dkr.ecr.us-east-1.amazonaws.com/cloudverse/api-gateway:v1

docker push \
865189140490.dkr.ecr.us-east-1.amazonaws.com/cloudverse/api-gateway:v1


# 🔐 Auth Service
docker build -t cloudverse-auth-service ./services/auth-service

docker tag cloudverse-auth-service:latest \
865189140490.dkr.ecr.us-east-1.amazonaws.com/cloudverse/auth-service:v1

docker push \
865189140490.dkr.ecr.us-east-1.amazonaws.com/cloudverse/auth-service:v1


# 👤 User Service
docker build -t cloudverse-user-service ./services/user-service

docker tag cloudverse-user-service:latest \
865189140490.dkr.ecr.us-east-1.amazonaws.com/cloudverse/user-service:v1

docker push \
865189140490.dkr.ecr.us-east-1.amazonaws.com/cloudverse/user-service:v1


# 🛍️ Product Service
docker build -t cloudverse-product-service ./services/product-service

docker tag cloudverse-product-service:latest \
865189140490.dkr.ecr.us-east-1.amazonaws.com/cloudverse/product-service:v1

docker push \
865189140490.dkr.ecr.us-east-1.amazonaws.com/cloudverse/product-service:v1


# 📦 Order Service
docker build -t cloudverse-order-service ./services/order-service

docker tag cloudverse-order-service:latest \
865189140490.dkr.ecr.us-east-1.amazonaws.com/cloudverse/order-service:v1

docker push \
865189140490.dkr.ecr.us-east-1.amazonaws.com/cloudverse/order-service:v1


# 🛒 Cart Service
docker build -t cloudverse-cart-service ./services/cart-service

docker tag cloudverse-cart-service:latest \
865189140490.dkr.ecr.us-east-1.amazonaws.com/cloudverse/cart-service:v1

docker push \
865189140490.dkr.ecr.us-east-1.amazonaws.com/cloudverse/cart-service:v1


# 🔔 Notification Service
docker build -t cloudverse-notification-service ./services/notification-service

docker tag cloudverse-notification-service:latest \
865189140490.dkr.ecr.us-east-1.amazonaws.com/cloudverse/notification-service:v1

docker push \
865189140490.dkr.ecr.us-east-1.amazonaws.com/cloudverse/notification-service:v1


# 📊 Analytics Service
docker build -t cloudverse-analytics-service ./services/analytics-service

docker tag cloudverse-analytics-service:latest \
865189140490.dkr.ecr.us-east-1.amazonaws.com/cloudverse/analytics-service:v1

docker push \
865189140490.dkr.ecr.us-east-1.amazonaws.com/cloudverse/analytics-service:v1


# 🔍 Search Service
docker build -t cloudverse-search-service ./services/search-service

docker tag cloudverse-search-service:latest \
865189140490.dkr.ecr.us-east-1.amazonaws.com/cloudverse/search-service:v1

docker push \
865189140490.dkr.ecr.us-east-1.amazonaws.com/cloudverse/search-service:v1
