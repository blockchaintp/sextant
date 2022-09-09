# Security Update: Log4Shell CVEs

Recently you may have seen security bulletins relating to Apache Log4j. A few of
our projects at BTP use this library for logging simply and straightforwardly.
We believe that the exploit risk in our images is relatively small. In every
case of our supported images, we use a relatively simple Log4j configuration
designed purely for use within a docker or Kubernetes environment. That
configuration is not meant to be modified in any way. Nevertheless, such
exploits can turn up never-before-seen attack vectors even in such restricted
configurations. Therefore we have diligently kept our codebase and images up to
date with the latest available fixes for the Log4j vulnerabilities.

The affected items are:

* [daml-on-besu](#daml-on-besu)
* [daml-on-sawtooth](#daml-on-sawtooth)
* [paralos-java](#paralos-java)

To protect your environments from the Log4J vulnerability, you should update
your configurations as soon as possible. You may find instructions on how to do
that below. If you have any questions, please don't hesitate to reach out to
BTP support.

This particular vulnerability is rapidly evolving, and we are tracking and
applying mitigation fixes as they are developed, if any further updates are
required we will inform you as they become available.

## daml-on-besu

If you are using Sextant and have never directly overridden the daml-on-besu
images, the preferred way to update your installation is to simply force any
existing deployments to update with the newer images via the release's
mutable tag.

If you have previously overridden your daml-on-besu images to an immutable tag,
you will need to update the URLs for the docker images.

Brand new deployments will have the fix automatically.

### daml-on-besu via mutable tag

First, perform an administrative restart to ensure that you have the most
recent charts loaded into Sextant following these
[instructions](../admin/operations.md).

Then for each daml-on-besu deployment, edit it to update its __Additional Yaml__
to incorporate the following:

```yaml
    besu:
      privateImage:
        imagePullPolicy: Always
      image:
        imagePullPolicy: Always
    daml:
      privateImage:
        imagePullPolicy: Always
      image:
        pullPolicy: Always
```

Finally, save this and re-deploy the network.

!!!Note
    The above instructions cause the Kubernetes deployment to pull the latest
    image down from the appropriate mutable tag for your release.

### daml-on-besu via immutable tags

The newest images and their immutable tags for the daml-on-besu are as follows:

* blockchaintp/besu:BTP2.1.0rc15-1.13.3
* blockchaintp/rpc:BTP2.1.0rc15-1.13.3

These may be updated directly in the __Additional YAML__ by incorporating the
following YAML appropriately:

```yaml
    besu:
      image:
        tag: BTP2.1.0rc15-1.13.3
    daml:
      image:
        tag: BTP2.1.0rc15-1.13.3
```

## daml-on-sawtooth

If you are using Sextant and have never directly overridden the daml-on-sawtooth
images, the preferred way to update your installation is to simply force any
existing deployments to update with the newer images via the release's
mutable tag.

If you have previously overridden your daml-on-sawtooth images to an immutable
tag, you will need to update the URLs for the docker images

Brand new deployments will have the fix automatically.

### daml-on-sawtooth via mutable tag

If you are using Sextant and have never directly overridden the daml-on-sawtooth
images, the preferred way to update your installation is to simply force any
existing deployments to update with the newer images.

First, perform an administrative restart to ensure that you have the most
recent charts loaded into Sextant following these
[instructions](../admin/operations.md).

Them for each daml-on-sawtooth deployment, edit it and update its
__Additional Yaml__ to incorporate the following:

```yaml
    image:
      pullPolicy: Always
    tp:
      image:
        pullPolicy: Always
```

Finally, save this and re-deploy the network.

!!!Note
    The above instructions cause the Kubernetes deployment to pull the latest
    image down from the appropriate mutable tag for your release.

### daml-on-sawtooth via immutable tags

The newest images and their immutable tags for the daml-on-sawtooth are as
follows:

* blockchaintp/sawtooth-daml-tp:BTP2.1.0rc15-1.13.4
* blockchaintp/sawtooth-daml-rpc:BTP2.1.0rc15-1.13.4

These may be updated directly in the __Additional YAML__ by incorporating the
following YAML appropriately:

```yaml
image:
  tag: BTP2.1.0rc15-1.13.4
tp:
  image:
    tag: BTP2.1.0rc15-1.13.4
```

## paralos-java

If you are using the paralos-java library, simply point you gradle or maven
dependency to the latest version which is __0.0.4__.
