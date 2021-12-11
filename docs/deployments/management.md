# Deployment Management

First select `Deployments`:

![Sextant Select Deployments](../images/sextant-select-deployments.png)

In addition to viewing all existing deployments managed by this instance of
Sextant or just those associated with a specific target cluster, there are four
basic management operations that apply to all deployments.

## Add a Deployment

### Step 1

On the `Deployments` page select your target cluster in the top right drop down.

![Select Target Cluster](../images/sextant-deployments-select-target.png)

### Step 2

Click `Add`. This will create a dropdown menu from which you can select your
specific deployment.

![Deployments Add Dropdown Menu](../images/sextant-deployments-add-menu.png)

### Step 3

Select your prefered deployment from the dropdown menu.

The current _distributed ledger_ deployment options are -

- [Hyperledger Besu](dlts/besu.md)
- [Hyperledger Sawtooth](dlts/sawtooth.md)

The current _smart contract_ deployment options are -

- [Daml on Besu](smart-contracts/daml-on-besu.md)
- [Daml on Sawtooth](smart-contracts/daml-on-sawtooth.md)
- [Daml on QLDB](smart-contracts/daml-on-qldb.md)
- [Daml on Postgres](smart-contracts/daml-on-postgres.md)

The current _information security_ options are -

- [TFS on Sawtooth](infosec/tfs-on-sawtooth.md)

In addition to these core deployments the dropdown menu includes some utility
deployments. These are documented [here](../topics/utility-deployments.md).

## Interact with a Deployment

Once a deployment has been successfully added to your target cluster you can
interact with it using the icons on the right.

- In all cases you can `Undeploy`, `Edit` and `View` a deployment. These
  generic interactions are covered in the next section
- In the case of the Daml deployments there is also a fourth `Settings` option
  (in the form of a _gear_ icon) which lets you interact with the Daml ledger
- In the case of the TFS on Sawtooth deployment there is also a fourth
  `Settings` option that lets you interact with the Taekion File System

## Generic Interactions

The three generic interactions are:

- [Undeploy a Deployment](#undeploy-a-deployment)
- [Edit a Deployment](#edit-a-deployment)
- [View a Deployment](#view-a-deployment)

These broadly follow the same pattern as before with cluster interactions.
WLOG we use a plain vanilla Sawtooth deployment to illustrate each interaction.

### Undeploy a Deployment

![Sextant Deployment Undeploy](../images/sextant-deployments-undeploy.png)

Clicking the `Undeploy` button prompts you to confirm:

![Sextant Deployment Undeploy Dialog](../images/sextant-deployments-undeploy-dialog.png)

Complete this dialog with the correct deployment name:

![Sextant Deployment Undeploy Confirm](../images/sextant-deployments-undeploy-confirm.png)

Clicking `Confirm` completes the deactivation:

![Sextant Deployment Undeployed Successfully](../images/sextant-deployments-undeployed-successfully.png)

__NOTE__ that at this point the only options available to you are now `Delete`,
which has replaced `Undeploy`, and `Edit`.

#### Permanently Delete a Deployment

![Sextant Deployment Delete](../images/sextant-deployments-delete.png)

Clicking the `Delete` button prompts you to confirm:

![Sextant Deployment Delete Dialog](../images/sextant-deployments-delete-dialog.png)

Complete the dialog with the correct deployment name:

![Sextant Deployment delete Confirm](../images/sextant-deployments-delete-confirm.png)

__WARNING__ Clicking `Confirm` deletes the deployment permanently.

#### Redeploy a Deployment

Alternatively you can select `Edit`:

![Sextant Deployment Edit 2](../images/sextant-deployments-edit-2.png)

This takes you to the `Edit` page for this deployment:

![Sextant Deployment Edit Redeploy](../images/sextant-deployments-edit-form.png)

At this point you can redeploy the deployment simply by scrolling down to the
bottom of the form then hitting the `Re-deploy` button:

![Sextant Deployment Edit Redeploy](../images/sextant-deployments-edit-redeploy.png)

__NOTE__ alternatively you can edit the deployment first because unlike cluster
management it is quite normal to cycle through undeploy-edit-redeploy especially
if the change is significant and you are not in production.

When you hit `Re-deploy` Sextant saves the deployment:

![Sextant Deployment Redeploying](../images/sextant-deployments-edit-redeploying.png)

Sextant then instructs Kubernetes to redeploy it and confirms when this is
finished:

![Sextant Deployment Redeployed](../images/sextant-deployments-edit-redeployed.png)

Return to [Generic Interactions](#generic-interactions)

### Edit a Deployment

If you can select `Edit`:

![Sextant Deployment Undeploy](../images/sextant-deployments-edit.png)

This takes you to the `Edit` page for this deployment:

![Sextant Deployment Edit Redeploy](../images/sextant-deployments-edit-form.png)

At this point you can make whatever modifications are appropriate to your
deployment, for example, in the case of a Sawtooth deployment this could be
adding or upgrading a custom transaction processor.

Once you have made your changed scroll down to the bottom of the form then hit
the `Re-deploy` button:

![Sextant Deployment Edit Redeploy](../images/sextant-deployments-edit-redeploy.png)

As above Sextant will save your deployment then instruct Kubernetes to redeploy
it and confirms when this is finished:

![Sextant Deployment Redeployed](../images/sextant-deployments-edit-redeployed.png)

__NOTE__ if you edit an active deployment it is important to understand that in
the case of a distributed ledger deployment this will result in a rolling
upgrade when you hit `Re-deploy` having edited your deployment.

Return to [Generic Interactions](#generic-interactions)

### View a Deployment

![Sextant Deployment Undeploy](../images/sextant-deployments-view.png)

Clicking the `View` button presents you with details of the deployment which in
this case is a Sawtooth deployment:

![Sextant Deployment Sawtooth View Deployment](../images/sextant-deployments-sawtooth-view-deployment.png)

__NOTE__ that in this example you can interact with the Sawtooth network and
delete individual pods:

![Sextant Deployment Sawtooth Delete Pod](../images/sextant-deployments-sawtooth-delete-pod.png)

// TODO - Explanation here

#### Audit Trail

However if you scroll down the `View` page for the deployment you can see the
audit trail of all tasks associated with it:

![Sextant Deployment Sawtooth View Audit Trail](../images/sextant-deployments-sawtooth-view-audit-trail.png)

Return to [Generic Interactions](#generic-interactions)
