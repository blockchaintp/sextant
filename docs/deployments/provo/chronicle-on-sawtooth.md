# Deploying Chronicle on Sawtooth

-----

__IMPORTANT__ `Chronicle on Sawtooth` cannot be deployed unless you have access
to BTP's official docker image registry. Once you have acquired the credentials
for this registry from BTP you will need to create the target namespace for your
deployment and create an image pull secret in that namespace that you can
reference later. In this example the
namespace is `chronicle-namespace` and the image pull secret is `dockerhub`:

```bash
kubectl create namespace chronicle-namespace
kubectl config set-context --current --namespace=chronicle-namespace
kubectl create secret docker-registry dockerhub --docker-username=<username> \
--docker-password='<password>' --docker-email=<email>
```

-----

Selecting `Chronicle on Sawtooth` in the deployments marketplace takes you to
its deployment form. Here you need to give your deployment a name
and specify its namespace using the one created above:

<!--
// TODO - ADD SCREEN CAPTURES USING CHROME FULL SCREEN ON MBP
![Sextant Deployments Chronicle on Sawtooth
Form](../../images/sextant-deployments-chronicle-sawtooth-form.png){.shadow}

Then you need to scroll down, enable image pull secrets and add the image pull
secret `dockerhub` you created above:

![Sextant Deployments Chronicle on Sawtooth
Deploy](../../images/sextant-deployments-chronicle-sawtooth-deploy.png){.shadow}

Click `Deploy` and the deployment will be created and added to the cluster:

![Sextant Deployments Chronicle on Sawtooth
Added](../../images/sextant-deployments-chronicle-sawtooth-added.png){.shadow}

// TODO - REINSTATE WHEN SETTINGS OPTION

Note that this deployment includes a `Settings` option - the _gear_ icon - which
is covered [here](chronicle-admin.md).
-->

Once your deployment has been added, you can view and interact with it as described
[here](../management.md#generic-interactions).

!!!Warning
    Deployment is not instantaneous as under the covers Sextant uses the
    appropriate helm chart to create your deployment which may involve pulling
    the appropriate images if these aren't already cached by the Kubernetes
    cluster.

## Sawtooth Services

Once a `Chronicle on Sawtooth` deployment is running it is possible to expose
various Sawtooth features using Kubernetes services. This is covered in depth
[here](../dlts/sawtooth-services.md).

## Deployment Options

Beyond configuring Sawtooth itself these are the deployment options supported by
Sextant.

### Custom Containers

This option allows you to specify, for example, a custom transaction processor.

### Image Pull Secrets

This option allows you to specify any image pull secrets that may be required in
order to access images related to your deployment that are hosted in a private
repository. These all need to be available in your target namespace.

### Advanced Options

#### Genesis Seed

This option allows you to change the genesis seed on redeployment.

#### Advanced Deployment Customization

This option provides advanced users with the ability to specify
_Additional YAML_ which will override default template options. We recommend
that you discuss any proposed customization with us first.
