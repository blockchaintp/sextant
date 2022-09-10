# Besu Services

## Background

An application running on a Kubernetes cluster must be explicitly exposed in
order to be accessed from outside of the cluster.  This is especially true in
the case of cloud environments such as AWS.

General documentation on how to expose Kubernetes applications may be found in
the [Kubernetes documentation](https://kubernetes.io/docs/tasks/access-application-cluster/service-access-application-cluster/)
where there is a nice [tutorial](https://kubernetes.io/docs/tutorials/kubernetes-basics/expose/expose-intro/)
as well.

Here we provide specific guidance on how to expose services of a Sextant
managed Besu deployment, specifically on an AWS hosted Kubernetes cluster,
whether EKS based or not.

## Overview

These examples assume that you have deployed a Besu network called
`test-network` in namespace `test-namespace`.

You can view the services currently defined using this command substituting
`test-namespace` for your Sawtooth namespace.

```bash
$ kubectl get svc --namespace=test-namespace
NAME                  TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)                                          AGE
test-network-besu     ClusterIP   None         <none>        8545/TCP,8546/TCP,8547/TCP,30303/TCP,30303/UDP   38s
test-network-besu-0   ClusterIP   None         <none>        8545/TCP,8546/TCP,8547/TCP,30303/TCP,30303/UDP   38s
test-network-besu-1   ClusterIP   None         <none>        8545/TCP,8546/TCP,8547/TCP,30303/TCP,30303/UDP   38s
test-network-besu-2   ClusterIP   None         <none>        8545/TCP,8546/TCP,8547/TCP,30303/TCP,30303/UDP   38s
test-network-besu-3   ClusterIP   None         <none>        8545/TCP,8546/TCP,8547/TCP,30303/TCP,30303/UDP   38s
```

* `test-network-besu` is a service which exposes the ports of all of the
  available besu in a balanced fashion.

* `test-network-besu-0` is a service which exposes the ports of besu node 0 (the
  first node in this statefulset).

* `test-network-besu-1` is a service which exposes the ports of besu node 1 (the
  second node in this statefulset).

* `test-network-besu-2` is a service which exposes the ports of besu node 2 (the
  third node in this statefulset).

* `test-network-besu-3` is a service which exposes the ports of besu node 3 (the
  fourth node in this statefulset).

## Ports

* JSON-RPC HTTP: `8545` the standard JSON-RPC HTTP port for besu.
* WS HTTP: `8546` the standard WS HTTP port for besu.
* GraphQL HTTP: `8547` the standard GraphQL HTTP port for besu.
* `30303` the standard P2P port for besu.
