# Deploying Daml on QLDB

-----

__IMPORTANT__ before creating a Daml on QLDB deployment you will need to prepare
your target EKS Cluster by following the instructions
[here](/docs/topics/eks-cluster-aws-services.md).

Note that you only have to do this once and if you have already deployed
Daml on QLDB or Daml on Postgres (with AWS Aurora as the remote Postgres) using
your target cluster then this step will already have been completed.

-----

Selecting `Daml on QLDB` in the deployments dropdown menu takes you to
its deployment form. Here you need to give your deployment a name, specify its
namespace and provide a Daml Ledger ID.

__NOTE__ if the Daml Ledger ID refers to an existing QLDB Ledger then Sextant
will use this otherwise it will create one.

In this example, we are not providing an existing QLDB Ledger as you can see
from our AWS Management Console:

![Sextant Deployments Daml on QLDB AWS Console 1](../../images/sextant-deployments-daml-qldb-aws-console-1.png)

Instead we are expecting Sextant to create a new QLDB Ledger `daml-ledger-001`:

![Sextant Deployments Daml on QLDB Form](../../images/sextant-deployments-daml-qldb-form.png)

Click `Deploy` and the deployment will be created and added to the cluster:

![Sextant Deployments Daml on QLDB Added](../../images/sextant-deployments-daml-qldb-added.png)

Note that this deployment includes a `Settings` option - the _gear_ icon - which
is covered [here](daml-ledger-admin.md).

Once your deployment has been added you can view interact with it as described
[here](../management.md#generic-interactions).

__NOTE__ deployment is not instantaneous as under the covers Sextant uses the
appropriate helm chart to create your deployment which can involve pulling the
appropriate images if these aren't already cached by the Kubernetes cluster.

In the case of a `Daml on QLDB` deployment it may also include the creation of
a QLDB Ledger as we can see here:

![Sextant Deployments Daml on QLDB AWS Console 2](../../images/sextant-deployments-daml-qldb-aws-console-2.png)

## Deployment Options

Beyond specifying whether you want to enable persistence for your deployment
these are the options supported by Sextant.

### Image Pull Secrets

This option allows you to specify any image pull secrets that may be required in
order to access images related to your deployment that are hosted in a private
repository. These all need to be available in your target namespace.

### Advanced Options

#### Advanced Deployment Customization

This option provides advanced users with the ability to specify
_Additional YAML_ which will override default template options. We recommend
that you discuss any proposed customization with us first.
