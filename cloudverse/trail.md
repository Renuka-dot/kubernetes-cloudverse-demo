````md
# 🧪 PostgreSQL Persistence Testing — CloudVerse

This file contains PostgreSQL persistence testing steps for the CloudVerse Kubernetes project.

The goal is to verify:

- PostgreSQL database access
- Table creation
- Data insertion
- PersistentVolumeClaim (PVC)
- AWS EBS persistence
- Kubernetes self-healing

---

# 🚀 STEP 1 — Check Running Pods

```bash
kubectl get pods -n cloudverse
````

Find PostgreSQL pod:

```text
postgres-xxxxx
```

Example:

```text
postgres-5c7c9c485d-kshfp
```

---

# 🚀 STEP 2 — Enter PostgreSQL Pod

```bash
kubectl exec -it <postgres-pod-name> -n cloudverse -- sh
```

Example:

```bash
kubectl exec -it postgres-5c7c9c485d-kshfp -n cloudverse -- sh
```

---

# 🚀 STEP 3 — Login to PostgreSQL

```bash
psql -U cloudverse
```

---

# 🚀 STEP 4 — List Databases

```sql
\l
```

Expected databases:

```text
cloudverse
postgres
template0
template1
```

---

# 🚀 STEP 5 — Show Existing Tables

```sql
\dt
```

---

# 🚀 STEP 6 — Create Orders Table

```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  product_name TEXT,
  amount INT
);
```

---

# 🚀 STEP 7 — Insert Sample Data

```sql
INSERT INTO orders(product_name, amount)
VALUES
('Docker Course', 79),
('Terraform Bootcamp', 89);
```

---

# 🚀 STEP 8 — Verify Data

```sql
SELECT * FROM orders;
```

Expected output:

```text
 id |    product_name    | amount
----+--------------------+--------
  1 | Docker Course      |     79
  2 | Terraform Bootcamp |     89
```

---

# 🚀 STEP 9 — Exit PostgreSQL

```sql
exit
```

Then:

```bash
exit
```

---

# 🚀 STEP 10 — Verify PVC

```bash
kubectl get pvc -n cloudverse
```

Expected:

```text
postgres-pvc   Bound
```

This confirms:

* Persistent storage attached
* AWS EBS volume mounted successfully

---

# 🚀 STEP 11 — Delete PostgreSQL Pod

```bash
kubectl delete pod <postgres-pod-name> -n cloudverse
```

Example:

```bash
kubectl delete pod postgres-5c7c9c485d-kshfp -n cloudverse
```

---

# 🚀 STEP 12 — Watch Pod Recreation

```bash
kubectl get pods -n cloudverse -w
```

Kubernetes automatically recreates the pod.

Example:

```text
postgres-xxxxx   Running
```

---

# 🚀 STEP 13 — Re-enter PostgreSQL Pod

```bash
kubectl exec -it <new-postgres-pod> -n cloudverse -- sh
```

Example:

```bash
kubectl exec -it postgres-5c7c9c485d-xdxpz -n cloudverse -- sh
```

---

# 🚀 STEP 14 — Login Again

```bash
psql -U cloudverse
```

---

# 🚀 STEP 15 — Verify Data Persistence

```sql
SELECT * FROM orders;
```

Expected:

```text
 id |    product_name    | amount
----+--------------------+--------
  1 | Docker Course      |     79
  2 | Terraform Bootcamp |     89
```

Data still exists even after pod deletion.

---

# 🔥 What This Demonstrates

| Concept            | Description                 |
| ------------------ | --------------------------- |
| Stateful Workload  | PostgreSQL                  |
| Stateless Workload | Microservices               |
| Persistence        | PVC                         |
| Dynamic Storage    | AWS EBS CSI Driver          |
| Self Healing       | Kubernetes recreates pod    |
| Data Durability    | EBS volume retains data     |
| Service Discovery  | Kubernetes Services         |
| Pod Communication  | Internal cluster networking |

---

# 🔥 Key Understanding

Microservices are stateless.

Persistent data is stored externally using:

* PostgreSQL
* PersistentVolumeClaims (PVC)
* AWS EBS volumes

Even if pod crashes:

* Kubernetes recreates pod
* Data remains safe
* Storage persists independently

---

# ✅ Useful Commands

---

# Show Pods

```bash
kubectl get pods -n cloudverse
```

---

# Show Services

```bash
kubectl get svc -n cloudverse
```

---

# Show PVC

```bash
kubectl get pvc -n cloudverse
```

---

# Show PV

```bash
kubectl get pv
```

---

# Show Node Placement

```bash
kubectl get pods -n cloudverse -o wide
```

---

# Show Storage Classes

```bash
kubectl get storageclass
```

```
```
