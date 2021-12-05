# Exposing Kubernetes Services

An application runnning on a Kubernetes cluster must be explicitly exposed in
order to be accessed from outside of the cluster.  This is especially true in
the case of cloud environments such as AWS.

General documentation on how to expose Kubernetes applications may be found in
the [Kubernetes documentation](https://kubernetes.io/docs/tasks/access-application-cluster/service-access-application-cluster/)
where there is a nice [tutorial](https://kubernetes.io/docs/tutorials/kubernetes-basics/expose/expose-intro/)
as well.

This document is intended to give more specific guidance on exposing services of
a Sextant deployed application, specifically on an AWS hosted Kubernetes
cluster, whether EKS based or not.

## Services

These examples assume that you have deployed a Sawtooth network called
`test-network` in namespace `test-namespace`.

You can view the services currently defined using this command substituting
`test-namespace` for your Sawtooth namespace.

```shell
kubectl get svc --namespace=test-namespace
```

* [Sawtooth REST API](#sawtooth-rest-api)

* [Grafana and Influxdb](#grafana-and-influxdb)

* [Sawtooth Validator Network](#sawtooth-validator-network)

### Sawtooth REST API

Conveniently a Sextant deployed Sawtooth network already contains a basic
service for the Sawtooth Rest API. Since this API is conventional HTTP, a
traditional load balancer will do. Therefore you can use this command.

__REMINDER__ Don't forget to substitute `test-network` and `test-namespace`
for your Sawtooth network name and namespace respectively.

```shell
kubectl expose service test-network-rest-api --name=test-network-rest-api-lb \
--port=8008 --target-port=8008 --type=LoadBalancer --namespace=test-namespace
```

Return to [Services](#services)

### Grafana and Influxdb

Similar to the REST API the grafana and influxdb instances deployed with
Sawtooth each already has a service defined. Therefore you can use these
commands.

__REMINDER__ Don't forget to substitute `test-network` and `test-namespace`
for your Sawtooth network name and namespace respectively.

```shell
kubectl expose service grafana --name=test-network-grafana-lb --port=3000 \
--target-port=3000 --type=LoadBalancer --namespace=test-namespace
```

```shell
kubectl expose service influxdb --name=test-network-influxdb-lb --port=8086 \
--target-port=8086 --type=LoadBalancer --namespace=test-namespace
```

__PLEASE NOTE__ the influxdb instance currently deployed is not particularly
secure, so exposing the influxdb to the outside world should be discouraged.
Any load balancer exposing the influxdb should use strict firewall (security
group) rules to tighten up access control.  We plan to address this in a future
Sextant release but for now, we do not recommend exposing the influxdb.

Return to [Services](#services)

### Sawtooth Validator Network

The Sawtooth validator network itself is a somewhat different than the other
servicces and protocols.  Validators must connect to each other directly and not
be mediated via any loadbalancing.  In order to prepare for this a Sextant
deployed Sawtooth network uses the direct hostPort `8800` on each of the nodes
(similar to a [NodePort](https://kubernetes.io/docs/concepts/services-networking/service/#nodeport))

In addition due to some limitations in Sawtooth 1.1 each validator must address
other validators using the same name that the target validator uses to refer to
itself (the value of its `--endpoint` argument).  Doing otherwise can create
some instability in the network.  On AWS each validator refers to itself via its
internal network name, e.g. `ip-192-168-183-187.us-west-2.compute.internal`.
In order to use a node as an external seed the this name must resolve via DNS to
the ip actually used to connect to the target validator.  However outside of AWS
or even a given VPC these `*.compute.internal` hostnames do not resolve
normally. Two mechanisms are available to resolve this.

#### Option 1

If one part of the network is outside of AWS, then effectively the network is
passing through NAT.  The best soluton in this case is to synch up the hostnames
on the connecting side to how the receiving side sees itself.  In order to
address this `/etc/hosts` entries or equivalent must be made for each of the
target hosts on the source network mapping the target host's name to
its _public ip address_.

#### Option 2

[VPC Peering](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-peering.html).
If the two portions of the network are both on AWS and
_do not have overlapping CIDRs_ then you can peer the two VPC's and enable DNS
resolution between the two VPC's.  This will allow both VPC's to communicate
directly and resolve their `*.compute.internal` hostnames.

Finally, AWS networks are closed to most traffic from the outside world by
default.  In order to connect directly to the validator hosts at all the
relevant security groups for the k8s worker nodes must be opened on port `8800`.
Peered VPC's still require individual security group configurations.

Return to [Services](#services)
