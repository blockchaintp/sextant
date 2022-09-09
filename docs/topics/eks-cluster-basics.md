# EKS Cluster Basics

## Tools

You will need the up to date versions of the following tools installed -

* [eksctl](https://eksctl.io/introduction/#installation)
* [helm](https://helm.sh/docs/intro/install/)
* [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl)

!!!Note
    If you are not familiar with it `eksctl` is the official Amazon EKS CLI tool.

## Create Amazon EKS Cluster

### Step 1

Run the following command to create a 4 node EKS cluster replacing
`<CLUSTER_NAME>` and `<REGION_NAME>` with a cluster name and region name of your
choice:

```bash
eksctl create cluster \
  --name <CLUSTER_NAME> \
  --region <REGION_NAME> \
  --node-type m5.large \
  --nodes 4 \
  --with-iodc \
  --managed
```

!!!Note
    A minimum of 4 nodes is required to support a Sawtooth network using the
    PBFT consensus plugin or a Besu network using IBFT consensus. However
    smaller clusters can be added to such an existing network

!!!Warning
    In the unlikely event that you choose a region that that doesn't support
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

## Using your Amazon EKS Cluster

Now that you have created this cluster you can add it to list of the target
clusters available to Sextant by following the instructions
[here](../clusters/management.md).

Alternatively if you intend to install Sextant on this cluster then you can
do so by following the instructions
[here](../installation/overview.md).

## Delete Amazon EKS cluster

!!!Warning
    Do not delete your EKS cluster if it is running Sextant or it is hosting
    any Sextant managed deployments.

Assuming that your EKS cluster isn't running Sextant then before deleting it
make sure that it isn't hosting any Sextant managed deployments. If it is and
you still want to delete it then

* Undeploy and delete any active deployments running on it using Sextant
* Then delete any provisioned clusters in Sextant

Run the following command to delete your EKS cluster replacing `<CLUSTER_NAME>`
and `<REGION_NAME>` with the appropriate cluster and region name:

```bash
eksctl delete cluster \
  --name <CLUSTER_NAME> \
  --region <REGION_NAME>
```
