# Fabric Services

## Background

An application running on a Kubernetes cluster must be explicitly exposed in
order to be accessed from outside of the cluster.  This is especially true in
the case of cloud environments such as AWS.

General documentation on how to expose Kubernetes applications may be found in
the [Kubernetes documentation](https://kubernetes.io/docs/tasks/access-application-cluster/service-access-application-cluster/)
where there is a nice [tutorial](https://kubernetes.io/docs/tutorials/kubernetes-basics/expose/expose-intro/)
as well.

Here we provide specific guidance on how to expose services of a Sextant
managed Fabric deployment, specifically on an AWS hosted Kubernetes cluster,
whether EKS based or not.

## Overview

These examples assume that you have deployed a Fabric network called
`test-network` in namespace `test-namespace`.

You can view the services currently defined using this command substituting
`test-namespace` for your Sawtooth namespace.

```shell
kubectl get svc --namespace=test-namespace
```

<!-- TODO: fill these out

* [Service 1](#service-1)

* [Service 2](#service-2)

* [Service 3](#service-3)

## Service 1

// TODO

Return to [Overview](#overview)

## Service 2

// TODO

Return to [Overview](#overview)

## Service 3

// TODO

Return to [Overview](#overview)
-->
