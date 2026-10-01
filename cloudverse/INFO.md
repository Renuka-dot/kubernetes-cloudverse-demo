# ☁️ CloudVerse — Architecture & Kubernetes Deep Dive

> Detailed architecture explanation for the CloudVerse Microservices DevOps Project running on AWS EKS.

---

# ✅ Recommended EKS Node Setup

For this CloudVerse project, you do NOT need a separate node for every microservice.

A good realistic setup for learning/demo purposes is:

| Node Type             | Purpose                    | Recommended Count |
| --------------------- | -------------------------- | ----------------- |
| General Worker Nodes  | Run UI + all microservices | 2 Nodes           |
| Database/Storage Node | Run PostgreSQL only        | 1 Node            |

---

# ✅ Recommended Total Nodes = 3 Nodes

---

# 🏗️ Why 3 Nodes?

Your manifests already contain:

* Node Affinity
* HPA
* PostgreSQL PVC
* Dedicated DB scheduling

This line inside `03-postgres-deployment.yaml` is the key:

```yaml
affinity:
  nodeAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
      nodeSelectorTerms:
        - matchExpressions:
            - key: role
              operator: In
              values:
                - database
```

Meaning:

👉 PostgreSQL pod should run ONLY on nodes labeled:

```bash
kubectl label node <node-name> role=database
```

---

# 🔥 Real Meaning of Your Setup

You are simulating a real production architecture.

---

# 🖥️ Node 1 + Node 2 → Application Nodes

These run:

* UI
* API Gateway
* Auth Service
* User Service
* Product Service
* Order Service
* Cart Service
* Notification Service
* Analytics Service
* Search Service

These are stateless microservices.

Kubernetes can freely move them between nodes.

---

# 💾 Node 3 → Database Node

This runs ONLY:

* PostgreSQL

Why?

Because databases usually need:

* Stable disk
* Dedicated resources
* Less noisy neighbors
* Better persistence
* Better IOPS

That’s why your manifest also contains:

```yaml
node-type=storage-optimized
```

---

# ☁️ Real Industry Architecture

Very common production setup:

```text
Application Nodes
├── Stateless apps
├── APIs
├── Frontends
├── Background workers
└── Autoscaling enabled

Database Nodes
├── PostgreSQL
├── MongoDB
├── Redis
└── Stateful workloads
```

---

# 📦 Explanation of Your Manifest Files

---

# 00-namespace.yaml

Creates isolated Kubernetes namespace.

```yaml
kind: Namespace
```

Everything runs inside:

```text
cloudverse
```

---

# 01-postgres-pv-pvc.yaml

Creates:

* StorageClass
* PersistentVolumeClaim

This gives PostgreSQL persistent storage.

Without this:

❌ Database data will be lost when pod restarts.

---

# 02-postgres-secret.yaml

Stores:

* DB username
* DB password
* JWT secret

Instead of hardcoding credentials inside deployments.

---

# 03-postgres-deployment.yaml

Deploys PostgreSQL pod.

Contains:

| Feature         | Purpose               |
| --------------- | --------------------- |
| Node Affinity   | Run only on DB node   |
| PVC Mount       | Persist database data |
| Probes          | Health checks         |
| Resource Limits | CPU/Memory control    |

---

# 04-postgres-service.yaml

Creates internal ClusterIP service:

```text
postgres-service
```

Other services access database using:

```text
postgres-service:5432
```

---

# 05 → 12 Service YAMLs

Each microservice contains:

* Deployment
* Service

Example:

* auth-service
* user-service
* product-service

Each contains:

| Section    | Purpose             |
| ---------- | ------------------- |
| Deployment | Creates pods        |
| Service    | Internal networking |
| Probes     | Health checks       |
| Resources  | CPU/Memory limits   |
| Replicas   | High availability   |

---

# 13-api-gateway.yaml

Central routing layer.

Frontend talks only to:

```text
api-gateway
```

Gateway forwards internally to:

* auth-service
* user-service
* product-service
* order-service

This is a very common enterprise architecture pattern.

---

# 🔥 Why API Gateway?

API Gateway helps with:

* Centralized authentication
* Request routing
* Logging
* Monitoring
* Rate limiting
* API aggregation
* Security

---

# 🔥 Current Project Architecture

This project demonstrates BOTH architectures.

---

# Pattern 1 — Direct Ingress Routing

```text
ALB
 ↓
Ingress
 ├── auth-service
 ├── product-service
 ├── user-service
 └── ui-service
```

---

# Pattern 2 — API Gateway Architecture

```text
ALB
 ↓
Ingress
 ↓
API Gateway
 ↓
Microservices
```

---

# 🔥 Best Demo Explanation

You can explain:

> This project demonstrates both direct ingress routing and API gateway-based microservice communication.

> Ingress handles external routing from AWS ALB into the Kubernetes cluster.

> API Gateway demonstrates centralized internal API management and service-to-service communication.

---

# 14-ui-service.yaml

Deploys React frontend.

Exposed externally via Ingress.

---

# 15-ingress.yaml

Most important networking component.

Creates:

# AWS ALB (Application Load Balancer)

Routes:

| Path            | Destination     |
| --------------- | --------------- |
| `/`             | UI              |
| `/api/auth`     | Auth Service    |
| `/api/products` | Product Service |
| `/api/gateway`  | API Gateway     |

This becomes your external entry point.

---

# 16-hpa.yaml

Horizontal Pod Autoscaler.

Automatically scales pods when CPU increases.

Example:

```yaml
minReplicas: 2
maxReplicas: 6
```

Kubernetes auto scales:

```text
2 → 3 → 4 → 5 → 6
```

depending on load.

---

# 🔥 Final Recommended EKS Setup

# Option 1 — BEST FOR LEARNING (Recommended)

| Node   | Purpose               |
| ------ | --------------------- |
| Node 1 | Application workloads |
| Node 2 | Application workloads |
| Node 3 | PostgreSQL only       |

---

# Option 2 — Cheap Demo Setup

| Node   | Purpose    |
| ------ | ---------- |
| Node 1 | Everything |

Cheaper but:

* No node affinity benefits
* Not realistic
* No high availability

---

# Option 3 — Production Style

| Node Group            | Count |
| --------------------- | ----- |
| App Node Group        | 2–5   |
| DB Node Group         | 2     |
| Monitoring Node Group | 1     |

More advanced enterprise setup.

---

# ⚠️ Important

Your manifests EXPECT:

```bash
kubectl label node <node-name> role=database
```

If you don’t label any node:

❌ PostgreSQL pod stays in:

```text
Pending
```

because affinity rule cannot find matching node.

---

# 🔥 Recommended Instance Types

| Purpose   | Instance  |
| --------- | --------- |
| App Nodes | t3.medium |
| DB Node   | t3.large  |

For demo:

* all can be `t3.medium`

---

# 🧠 Key Kubernetes Concepts Demonstrated

| Concept            | In This Project     |
| ------------------ | ------------------- |
| Stateful Workload  | PostgreSQL          |
| Stateless Workload | Microservices       |
| Service Discovery  | ClusterIP + CoreDNS |
| Ingress            | AWS ALB             |
| Autoscaling        | HPA                 |
| Scheduling         | Node Affinity       |
| Persistence        | PVC                 |
| Secrets            | Kubernetes Secret   |
| Health Checks      | Liveness/Readiness  |
| High Availability  | Multiple replicas   |

---

# 🔥 Pod-to-Pod Communication Demo

Example:

```text
order-service
   ↓
notification-service
```

Internal communication happens using:

```text
http://notification-service:4006
```

NOT through ALB.

NOT through public URLs.

This demonstrates:

* Internal Kubernetes networking
* ClusterIP services
* CoreDNS service discovery
* Pod-to-pod communication

---

# 🧪 Best Demo Commands

## Show Nodes

```bash
kubectl get nodes
```

---

## Show Pods

```bash
kubectl get pods -n cloudverse -o wide
```

---

## Show Services

```bash
kubectl get svc -n cloudverse
```

---

## Show Ingress

```bash
kubectl get ingress -n cloudverse
```

---

## Exec Into Pod

```bash
kubectl exec -it -n cloudverse <pod-name> -- sh
```

---

## Test Pod-to-Pod Communication

```bash
curl http://notification-service:4006/health
```

---

## Show HPA

```bash
kubectl get hpa -n cloudverse
```

---

## Show PVC

```bash
kubectl get pvc -n cloudverse
```

---

# 👨‍💻 Final Summary

This project demonstrates:

* Docker
* AWS ECR
* Kubernetes (EKS)
* AWS ALB Ingress
* API Gateway
* Pod-to-Pod Communication
* Node Affinity
* PVC/Persistent Storage
* HPA Autoscaling
* Rolling Updates
* Liveness & Readiness Probes
* Service Discovery
* High Availability

This is a strong real-world DevOps portfolio project suitable for interviews, demos, and training.

