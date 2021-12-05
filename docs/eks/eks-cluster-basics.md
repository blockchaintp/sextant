# EKS Cluster Basics

## Create Amazon EKS Cluster

### Step 1

Run the following command to create a 4 node EKS cluster selecting a cluster
name and region name of your choice

```bash
eksctl create cluster \
  --name <CLUSTER_NAME> \
  --region <REGION_NAME> \
  --node-type m5.large \
  --nodes 4
```

* Note that a minimum of 4 nodes is required to support a Sawtooth network using
  the PBFT consensus plugin. However smaller clusters can be added to such an
  existing Sawtooth network

* If you choose a region that that doesn't support
  [Amazon EKS](https://aws.amazon.com/about-aws/global-infrastructure/regional-product-services/)
  then eksctl will report an error and list the supported regions

### Step 2

Make a brew as this is going to take a few minutes

### Step 3

Once your cluster is ready run the following command to check its configuration

```bash
  kubectl get svc
```

This should return something similar to this

```json
NAME         TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
kubernetes   ClusterIP   10.100.0.1   <none>        443/TCP   9m45s
```

Now you should be all set to add this cluster to the list of available clusters
in _Sextant_ assuming this is already running. Otherwise you can of course
install and instance of _Sextant_ on it first.

__NOTE__ _Sextant_ only needs to be installed on one of your clusters unless you
are running multiple environments such as development, QA, staging and
production.

-----
_It is important to tear down any resources once you have finished with them
otherwise you will continue to be billed for them_

## Delete Amazon EKS cluster

__WARNING__ Do not delete your EKS cluster if it is running _Sextant_.

1. Before deleting your EKS cluster, delete any active deployment running on it
   using _Sextant_

1. Then, delete any provisioned clusters in _Sextant_

1. Run the following command to delete your EKS cluster specifying the cluster
   name and region name for completeness

```bash
eksctl delete cluster \
  --name <CLUSTER_NAME> \
  --region <REGION_NAME>
```
