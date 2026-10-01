````md
# 🧹 CloudVerse Cleanup Guide

> This guide helps you properly clean up AWS EKS resources created during the CloudVerse project deployment.

---

# ⚠️ Why Cleanup Is Important

When you delete an EKS cluster:

```bash
eksctl delete cluster --name my-eks-cluster --region us-east-1
````

AWS usually deletes:

* Worker Nodes
* Node Groups
* Security Groups
* Load Balancers
* Auto Scaling Groups

BUT sometimes the following resources still remain:

* EBS Volumes
* Persistent Volumes
* Elastic Network Interfaces (rare)
* Security Groups (rare)

If you forget to clean them:

❌ AWS billing continues
❌ Unused resources remain
❌ Storage costs increase

---

# 🚀 STEP 1 — Delete Kubernetes Namespace

This removes:

* Pods
* Deployments
* Services
* Ingress
* ConfigMaps
* Secrets
* PVCs

```bash
kubectl delete namespace cloudverse
```

---

# ✅ Verify Namespace Deletion

```bash
kubectl get ns
```

Ensure:

```text
cloudverse
```

is removed.

---

# 🚀 STEP 2 — Verify PVC Deletion

```bash
kubectl get pvc --all-namespaces
```

Ensure:

```text
postgres-pvc
```

is deleted.

---

# 🚀 STEP 3 — Verify Persistent Volumes

```bash
kubectl get pv
```

Sometimes PVs remain in:

* Released
* Failed

state.

---

# 🚀 STEP 4 — Delete Remaining Persistent Volumes

If any PV still exists:

```bash
kubectl delete pv <pv-name>
```

Example:

```bash
kubectl delete pv pvc-12345678-abcd-efgh
```

---

# 🚀 STEP 5 — Check Remaining EBS Volumes

```bash
aws ec2 describe-volumes \
  --region us-east-1 \
  --query "Volumes[*].[VolumeId,State,Size]" \
  --output table
```

---

# ✅ Look For

Volumes in:

```text
available
```

state.

These are unattached orphaned volumes.

---

# 🚀 STEP 6 — Delete Unused EBS Volumes

```bash
aws ec2 delete-volume \
  --volume-id <volume-id> \
  --region us-east-1
```

Example:

```bash
aws ec2 delete-volume \
  --volume-id vol-0123456789abcdef0 \
  --region us-east-1
```

---

# 🚀 STEP 7 — Verify Load Balancers

```bash
aws elbv2 describe-load-balancers \
  --region us-east-1
```

Ensure old ALBs are deleted.

---

# 🚀 STEP 8 — Delete EKS Cluster

```bash
eksctl delete cluster \
  --name my-eks-cluster \
  --region us-east-1
```

---

# 🚀 STEP 9 — Final Verification

---

# Verify Clusters

```bash
eksctl get cluster --region us-east-1
```

Expected:

```text
No clusters found
```

---

# Verify EBS Volumes

```bash
aws ec2 describe-volumes \
  --region us-east-1 \
  --query "Volumes[*].[VolumeId,State]" \
  --output table
```

---

# Verify Load Balancers

```bash
aws elbv2 describe-load-balancers \
  --region us-east-1
```

---

```bash

export AWS_REGION=us-east-1

aws ecr delete-repository --repository-name cloudverse/ui-service           --region $AWS_REGION --force
aws ecr delete-repository --repository-name cloudverse/api-gateway          --region $AWS_REGION --force
aws ecr delete-repository --repository-name cloudverse/auth-service         --region $AWS_REGION --force
aws ecr delete-repository --repository-name cloudverse/user-service         --region $AWS_REGION --force
aws ecr delete-repository --repository-name cloudverse/product-service      --region $AWS_REGION --force
aws ecr delete-repository --repository-name cloudverse/order-service        --region $AWS_REGION --force
aws ecr delete-repository --repository-name cloudverse/cart-service         --region $AWS_REGION --force
aws ecr delete-repository --repository-name cloudverse/notification-service --region $AWS_REGION --force
aws ecr delete-repository --repository-name cloudverse/analytics-service    --region $AWS_REGION --force
aws ecr delete-repository --repository-name cloudverse/search-service       --region $AWS_REGION --force

```

# Verify Running EC2 Instances

```bash
aws ec2 describe-instances \
  --region us-east-1 \
  --query "Reservations[*].Instances[*].[InstanceId,State.Name]" \
  --output table
```

---

# 🔥 Recommended Cleanup Order

| Step | Action                       |
| ---- | ---------------------------- |
| 1    | Delete Namespace             |
| 2    | Verify PVC Cleanup           |
| 3    | Verify PV Cleanup            |
| 4    | Delete Remaining EBS Volumes |
| 5    | Verify ALB Cleanup           |
| 6    | Delete EKS Cluster           |
| 7    | Final AWS Verification       |

---

# 🧠 Important Kubernetes Concepts

| Resource    | Purpose                          |
| ----------- | -------------------------------- |
| PVC         | Kubernetes storage request       |
| PV          | Actual Kubernetes storage object |
| EBS Volume  | Actual AWS disk                  |
| EKS Cluster | Kubernetes control plane         |
| ALB         | External ingress traffic         |
| Node Group  | Worker nodes                     |

---

# ⚠️ Cost Optimization Tips

Always verify:

* EBS volumes deleted
* Load balancers deleted
* EC2 instances terminated
* Cluster deleted

Otherwise AWS billing continues.

---

# ✅ Final Checklist

| Resource            | Status |
| ------------------- | ------ |
| Namespace Deleted   | ✅      |
| PVC Deleted         | ✅      |
| PV Deleted          | ✅      |
| EBS Volume Deleted  | ✅      |
| ALB Deleted         | ✅      |
| Node Group Deleted  | ✅      |
| EKS Cluster Deleted | ✅      |

---

# 🎯 Final Goal

After cleanup:

✅ No running infrastructure
✅ No orphaned EBS volumes
✅ No unused ALBs
✅ No AWS billing surprises

```
```
