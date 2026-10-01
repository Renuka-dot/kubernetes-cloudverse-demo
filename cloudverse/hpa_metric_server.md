Kubernetes Horizontal Pod Autoscaler (HPA)

Metrics Server Setup (EKS / Kubernetes 1.24+)
If a Metrics Server is already installed (either by default or from a previous setup), delete the existing resources before installing the latest official version.

Step 1: Remove Existing Metrics Server (If Present)
```
kubectl delete deployment metrics-server -n kube-system
kubectl delete service metrics-server -n kube-system
kubectl delete apiservice v1beta1.metrics.k8s.io
kubectl delete clusterrole system:metrics-server
kubectl delete clusterrolebinding system:metrics-server
```
⚠️ Run these commands only if Metrics Server is already installed.

Step 2: Install the Latest Official Metrics Server
```
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```
This will automatically create:
ServiceAccount
ClusterRoles
ClusterRoleBindings
Service
Deployment
APIService

Step 3: Verify Installation
```
 kubectl top nodes - Shows CPU and Memory usage of each Node in the cluster.
 kubectl top pods - Shows CPU and Memory usage of each Pod.
 Why These Commands Are Important:-
 Get data from metrics-server
 Confirm metrics-server is working
 Help debug resource usage
 Help verify HPA scaling
 Help detect high CPU / memory usage
 
 It automatically creates these Kubernetes resources:
 | Resource           | Purpose                                   |
| ------------------ | ----------------------------------------- |
| ServiceAccount     | Identity for metrics-server pod           |
| ClusterRole        | Permissions to read node/pod metrics      |
| ClusterRoleBinding | Attach permissions to service account     |
| Service            | Internal service to expose metrics-server |
| Deployment         | Runs metrics-server pod                   |
| APIService         | Registers new API: `metrics.k8s.io`       |

Why RBAC is Required

Metrics Server must access:
Node metrics
Pod metrics
Kubelet stats
These are restricted resources.

So we must give permissions using RBAC.
```
```
kubectl get pods -n kube-system
kubectl top nodes
kubectl top pods
```

If CPU and Memory metrics are displayed, Metrics Server is working correctly.
Optional (For EKS Clusters)

If you face TLS or 403 errors, edit the deployment and add:
```
kubectl edit deployment metrics-server -n kube-system
```
Add these arguments under args::

```
- --kubelet-insecure-tls
- --kubelet-preferred-address-types=InternalIP
```

For CPU
If you just want to hit it 10 times sequentially, use:
```
for i in {1..10}; do curl -s http://localhost:8080/cpu; done
```
🔹 If You Want to See the Request Number
```
for i in {1..10}; do 
  echo "Request $i"
  curl -s http://localhost:8080/cpu
done
```

For memory
```
for i in {1..10}; do curl -s http://localhost:8080/memory; done
```
```
for i in {1..10}; do 
  echo "Request $i"
  curl -s http://localhost:8080/memory
done
```
