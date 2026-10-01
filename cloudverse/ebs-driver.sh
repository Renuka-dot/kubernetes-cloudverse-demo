```bash
#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════
#
#   HiQode — AWS EBS CSI Driver Installation — EKS
#
#   Cluster : my-eks-cluster
#   Region  : us-east-1
#
# ═══════════════════════════════════════════════════════════════════════════


# ───────────────────────────────────────────────────────────────────────────
# STEP 1 — Associate IAM OIDC Provider
# ───────────────────────────────────────────────────────────────────────────

eksctl utils associate-iam-oidc-provider \
  --region us-east-1 \
  --cluster my-eks-cluster \
  --approve


# Verify OIDC Provider
aws iam list-open-id-connect-providers


# ───────────────────────────────────────────────────────────────────────────
# STEP 2 — Create IAM Service Account for EBS CSI Driver
# ───────────────────────────────────────────────────────────────────────────

eksctl create iamserviceaccount \
  --name ebs-csi-controller-sa \
  --namespace kube-system \
  --cluster my-eks-cluster \
  --role-name AmazonEKS_EBS_CSI_DriverRole \
  --role-only \
  --attach-policy-arn arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy \
  --approve \
  --region us-east-1


# ───────────────────────────────────────────────────────────────────────────
# STEP 3 — Get AWS Account ID
# ───────────────────────────────────────────────────────────────────────────

AWS_ACCOUNT_ID=$(aws sts get-caller-identity \
  --query Account \
  --output text)

echo "AWS Account ID: $AWS_ACCOUNT_ID"


# ───────────────────────────────────────────────────────────────────────────
# STEP 4 — Install EBS CSI Driver Addon
# ───────────────────────────────────────────────────────────────────────────

aws eks create-addon \
  --cluster-name my-eks-cluster \
  --addon-name aws-ebs-csi-driver \
  --service-account-role-arn arn:aws:iam::$AWS_ACCOUNT_ID:role/AmazonEKS_EBS_CSI_DriverRole \
  --region us-east-1


# ───────────────────────────────────────────────────────────────────────────
# STEP 5 — Verify Addon Installation
# ───────────────────────────────────────────────────────────────────────────

aws eks describe-addon \
  --cluster-name my-eks-cluster \
  --addon-name aws-ebs-csi-driver \
  --region us-east-1


# ───────────────────────────────────────────────────────────────────────────
# STEP 6 — Verify CSI Driver Pods
# ───────────────────────────────────────────────────────────────────────────

kubectl get pods -n kube-system | grep ebs


# EXPECTED OUTPUT:
#
# ebs-csi-controller-xxxxx     Running
# ebs-csi-controller-xxxxx     Running
# ebs-csi-node-xxxxx           Running


# ───────────────────────────────────────────────────────────────────────────
# STEP 7 — Verify StorageClass
# ───────────────────────────────────────────────────────────────────────────

kubectl get storageclass


# EXPECTED:
#
# gp2
# gp3
#
# One should be DEFAULT


# ───────────────────────────────────────────────────────────────────────────
# STEP 8 — Test PVC Creation
# ───────────────────────────────────────────────────────────────────────────

kubectl apply -f k8s-manifests/01-postgres-pv-pvc.yaml


# Verify PVC Status
kubectl get pvc -n cloudverse


# EXPECTED:
#
# STATUS = Bound


# ───────────────────────────────────────────────────────────────────────────
# TROUBLESHOOTING
# ───────────────────────────────────────────────────────────────────────────

# Check CSI Driver Pods
kubectl get pods -n kube-system

#
BOTH get installed
# | Component            | Installed? | Purpose                            |
# | -------------------- | ---------- | ---------------------------------- |
# | `ebs-csi-controller` | ✅ Yes      | Cluster-level storage management   |
# | `ebs-csi-node`       | ✅ Yes      | Node-level volume mount operations |

# Check Addon Status
aws eks describe-addon \
  --cluster-name my-eks-cluster \
  --addon-name aws-ebs-csi-driver \
  --region us-east-1

# Check PVC Events
kubectl describe pvc postgres-pvc -n cloudverse

# Check StorageClasses
kubectl get storageclass

# Check EBS Volumes
aws ec2 describe-volumes --region us-east-1


# ═══════════════════════════════════════════════════════════════════════════
#
# WHAT THIS ENABLES
#
# → Persistent PostgreSQL Storage
# → Dynamic EBS Volume Provisioning
# → Stateful Workloads
# → Kubernetes Persistent Volumes
# → AWS EBS Integration
#
# ═══════════════════════════════════════════════════════════════════════════
```
