# PostgreSQL on Kubernetes

This folder contains the Kubernetes configuration required to run PostgreSQL in the CloudVerse project.

```text
01-postgres-pv-pvc.yaml
        ↓
Persistent Storage

02-postgres-secret.yaml
        ↓
Database Configuration / Passwords

03-postgres-deployment.yaml
        ↓
PostgreSQL Pod
```

---

## 1. `01-postgres-pv-pvc.yaml`

This file creates the storage configuration for PostgreSQL.

### StorageClass

```yaml
kind: StorageClass
name: cloudverse-ebs
provisioner: ebs.csi.aws.com
```

This tells Kubernetes to use **AWS EBS** for persistent storage.

```yaml
parameters:
  type: gp3
  encrypted: "true"
```

So the EBS volume will use:

* `gp3` → EBS volume type
* `encrypted: true` → Storage is encrypted

### PVC

```yaml
kind: PersistentVolumeClaim
name: postgres-pvc
```

The application requests:

```yaml
storage: 20Gi
```

So PostgreSQL gets **20 GB of persistent storage**.

```text
PostgreSQL Pod
      ↓
postgres-pvc
      ↓
AWS EBS
```

If the PostgreSQL Pod is deleted or recreated, the data can remain on the persistent volume.

---

# 2. `02-postgres-secret.yaml`

This file stores PostgreSQL configuration and sensitive values.

Example:

```yaml
POSTGRES_DB: cloudverse
POSTGRES_USER: cloudverse
POSTGRES_PASSWORD: cloudverse123
```

The PostgreSQL Deployment reads these values using:

```yaml
envFrom:
  - secretRef:
      name: postgres-secret
```

So we don't need to write the database configuration directly inside the Deployment.

```text
postgres-secret
       ↓
PostgreSQL Container
       ↓
Environment Variables
```

> For a real production environment, don't commit real passwords/secrets to Git.

---

# 3. `03-postgres-deployment.yaml`

This file actually creates the PostgreSQL Pod.

---

## A. Node Affinity

```yaml
affinity:
  nodeAffinity:
```

Node affinity controls **which worker node Kubernetes should use for PostgreSQL**.

### Required

```yaml
requiredDuringSchedulingIgnoredDuringExecution:
  ...
  key: role
  values:
    - database
```

This means:

> PostgreSQL **must** run on a node having:

```text
role=database
```

Therefore we label one worker node:

```bash
kubectl label node <node-name> role=database
```

Example:

```text
Node 1 → Application
Node 2 → Application
Node 3 → role=database → PostgreSQL
```

If no node has `role=database`, PostgreSQL will remain **Pending**.

---

## B. Preferred Node

```yaml
preferredDuringSchedulingIgnoredDuringExecution:
```

This is a **preference**, not a requirement.

```yaml
key: node-type
values:
  - storage-optimized
```

We can label the database node:

```bash
kubectl label node <node-name> node-type=storage-optimized
```

This tells Kubernetes:

> Prefer a storage-optimized node when possible.

So:

```text
role=database
        ↓
REQUIRED

node-type=storage-optimized
        ↓
PREFERRED
```

The `role=database` label controls the mandatory placement.

The `node-type=storage-optimized` label provides an additional scheduling preference.

---

# 4. PostgreSQL Container

```yaml
containers:
  - name: postgres
    image: postgres:15-alpine
```

This starts a PostgreSQL 15 container.

```yaml
ports:
  - containerPort: 5432
```

PostgreSQL uses port:

```text
5432
```

---

# 5. Database Configuration

```yaml
envFrom:
  - secretRef:
      name: postgres-secret
```

This loads the values from:

```text
postgres-secret
```

into the PostgreSQL container as environment variables.

---

# 6. Persistent Storage Mount

```yaml
volumeMounts:
  - name: postgres-storage
    mountPath: /var/lib/postgresql/data
```

PostgreSQL stores its database files under:

```text
/var/lib/postgresql/data
```

We mount the persistent storage at this location.

```text
PostgreSQL
    ↓
/var/lib/postgresql/data
    ↓
postgres-pvc
    ↓
AWS EBS
```

This is important because database data should not depend only on the Pod's temporary filesystem.

---

# 7. CPU and Memory

```yaml
resources:
  requests:
    cpu: 250m
    memory: 256Mi

  limits:
    cpu: 500m
    memory: 512Mi
```

### Request

The Pod requests:

```text
CPU    → 250m = 0.25 CPU
Memory → 256Mi
```

### Limit

The container can use up to:

```text
CPU    → 500m = 0.5 CPU
Memory → 512Mi
```

Simple rule:

```text
requests = resources needed for scheduling

limits = maximum resources allowed
```

---

# 8. Liveness Probe

```yaml
livenessProbe:
  exec:
    command:
      - pg_isready
      - -U
      - cloudverse
      - -d
      - cloudverse
```

Kubernetes runs:

```bash
pg_isready -U cloudverse -d cloudverse
```

to check whether PostgreSQL is alive.

If PostgreSQL becomes unhealthy, Kubernetes can restart the container.

```text
PostgreSQL
    ↓
Health Check
    ↓
Healthy → Continue
Unhealthy → Restart
```

---

# 9. Readiness Probe

```yaml
readinessProbe:
  exec:
    command:
      - pg_isready
      - -U
      - cloudverse
      - -d
      - cloudverse
```

Readiness checks whether PostgreSQL is **ready to accept requests**.

```text
PostgreSQL starting
        ↓
    Not Ready
        ↓
PostgreSQL ready
        ↓
      Ready
```

This is different from liveness:

```text
Liveness  → Is the container alive?

Readiness → Is the application ready to receive traffic?
```

---

# 10. Connecting the Storage

At the bottom of the Deployment:

```yaml
volumes:
  - name: postgres-storage
    persistentVolumeClaim:
      claimName: postgres-pvc
```

This connects the Deployment to the PVC created in:

```text
01-postgres-pv-pvc.yaml
```

So the complete flow is:

```text
03-postgres-deployment.yaml
            ↓
       PostgreSQL Pod
            ↓
      postgres-pvc
            ↓
       StorageClass
            ↓
        AWS EBS gp3
```

---

# Simple Summary

Students should remember these three files like this:

| File                          | Purpose                                        |
| ----------------------------- | ---------------------------------------------- |
| `01-postgres-pv-pvc.yaml`     | Provides persistent AWS EBS storage            |
| `02-postgres-secret.yaml`     | Provides database configuration/secrets        |
| `03-postgres-deployment.yaml` | Runs PostgreSQL and connects it to the storage |

### PostgreSQL Architecture

```text
                EKS Worker Nodes
                       |
        ┌──────────────┼──────────────┐
        |              |              |
      Node 1         Node 2         Node 3
    Application     Application    role=database
                                      |
                                      ↓
                                PostgreSQL Pod
                                      |
                              postgres-pvc
                                      |
                                      ↓
                                  AWS EBS
                                   gp3
```

### Important Commands

Check nodes:

```bash
kubectl get nodes
```

Label the database node:

```bash
kubectl label node <node-name> role=database
kubectl label node <node-name> node-type=storage-optimized
```

Check PostgreSQL:

```bash
kubectl get pods -n cloudverse
```

Check storage:

```bash
kubectl get pvc -n cloudverse
```

Check where PostgreSQL is running:

```bash
kubectl get pod -n cloudverse -o wide
```

The main concepts demonstrated by PostgreSQL are:

**Node Affinity + Secrets + Persistent Storage + Resource Requests/Limits + Liveness + Readiness**
