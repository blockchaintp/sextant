# Deploying Daml on Postgres

-----

__IMPORTANT__ If you intend to use AWS Aurora then you will need to prepare your
target EKS Cluster by following the instructions
[here](/docs/topics/eks-cluster-aws-services.md).

Note that you only have to do this once and if you have already deployed
Daml on QLDB using your target cluster then this step will already have been
completed.

-----

Selecting `Daml on Postgres` in the deployments dropdown menu takes you to
its deployment form. Here you need to give your deployment a name, specify its
namespace using the one created above and decide whether you want Sextant to
create a Postgres database (the `Local` option) or use a Postgres instance
supplied by you (the `Remote` option).

In this example we've opted for the local option and to enable persistence and
specified `gp2` as the storage class as we are using AWS:

![Sextant Deployments Daml on Besu Form](../../images/sextant-deployments-daml-postgress-form.png)

Then you need to scroll down,supply you Postgres credentials. Here we've opted
to supply a password but you can also provide a secret containing the field
`password` and your preferred password:

![Sextant Deployments Daml on Besu Deploy](../../images/sextant-deployments-daml-postgres-deploy.png)

Click `Deploy` and the deployment will be created and added to the cluster:

![Sextant Deployments Daml on Besu Added](../../images/sextant-deployments-daml-postgres-added.png)

Note that this deployment includes a `Settings` option - the _gear_ icon - which
is covered [here](daml-ledger-admin.md).

Once you deployment has been added you can view interact with it as described
[here](../management.md#generic-interactions).

__NOTE__ deployment is not instantaneous as under the covers Sextant uses the
appropriate helm chart to create your deployment which can involve pulling the
appropriate images if these aren't already cached by the Kubernetes cluster.

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
