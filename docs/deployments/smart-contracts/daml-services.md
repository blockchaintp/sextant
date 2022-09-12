# Daml Services

## Background

An application running on a Kubernetes cluster must be explicitly exposed in
order to be accessed from outside of the cluster.  This is especially true in
the case of cloud environments such as AWS.

General documentation on how to expose Kubernetes applications may be found in
the [Kubernetes documentation](https://kubernetes.io/docs/tasks/access-application-cluster/service-access-application-cluster/)
where there is a nice [tutorial](https://kubernetes.io/docs/tutorials/kubernetes-basics/expose/expose-intro/)
as well.

Here we provide specific guidance on how to expose services of a Sextant-managed
Daml deployment, specifically on an AWS-hosted Kubernetes cluster,
whether EKS-based or not.

## Overview

These examples assume that you have deployed a Sawtooth network called
`test-network` in namespace `test-namespace`.

You can view the services currently defined using this command substituting
`test-namespace` for your Sawtooth namespace.

```shell
$ kubectl get svc --namespace=test-namespace
NAME                                          TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)                      AGE
test-network-daml-daml-on-sawtooth            ClusterIP   None             <none>        39000/TCP                    22s
test-network-daml-daml-on-sawtooth-jsonapi    ClusterIP   None             <none>        8080/TCP                     22s
test-network-daml-daml-on-sawtooth-tp         ClusterIP   None             <none>        <none>                       22s
test-network-daml-daml-on-sawtooth-triggers   ClusterIP   None             <none>        <none>                       22s
test-network-daml-sawtooth                    ClusterIP   None             <none>        8008/TCP,8800/TCP,4004/TCP   22s
test-network-daml-sawtooth-0                  ClusterIP   172.20.194.67    <none>        8008/TCP,8800/TCP,4004/TCP   22s
test-network-daml-sawtooth-1                  ClusterIP   172.20.171.137   <none>        8008/TCP,8800/TCP,4004/TCP   22s
test-network-daml-sawtooth-2                  ClusterIP   172.20.43.3      <none>        8008/TCP,8800/TCP,4004/TCP   22s
test-network-daml-sawtooth-3                  ClusterIP   172.20.85.250    <none>        8008/TCP,8800/TCP,4004/TCP   22s
```

## gRPC API

The gRPC in our Daml installation is exposed on port 39000. In our example this
is made available via the `test-network-daml-daml-on-sawtooth`.

```text
test-network-daml-daml-on-sawtooth            ClusterIP   None             <none>        39000/TCP                    22s
```

This service may further be exposed outside the cluster via an ingress by
setting the `ingress.*` settings in the deployment, although this is not
recommended.

## JSON API

The Daml JSON-API is exposed on port 8080. In our example this is made available
via the `test-network-daml-daml-on-sawtooth-jsonapi`.

```text
test-network-daml-daml-on-sawtooth-jsonapi    ClusterIP   None             <none>        8080/TCP                     22s
```

This service may further be exposed outside the cluster via an ingress by
setting the `jsonapi.ingress.*` settings in the deployment.  The JSON-API is the
preferred way to expose the Daml services to the outside world.
