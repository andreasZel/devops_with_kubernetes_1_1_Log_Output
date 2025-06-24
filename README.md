# Log output application for 1.1 Exercise of Devops with Kubernetes

This application is written in node.js, there is an image created with the
dockerfile [here](https://hub.docker.com/repository/docker/zelhs/randomstring/general).

In order to run with kubernetes we first create our cluster with **k3d**:
```bash
k3d cluster create -a 2
```
then we deploy our image from the repo:
```bash
kubectl create deployment logoutput --image=zelhs/randomstring
```
we then list our pods and get it's logs:
```bash
kubectl get pods
kubectl logs logoutput-9c7974789-7h6h9 # logoutput-9c7974789-7h6h9 was my pod name
```

