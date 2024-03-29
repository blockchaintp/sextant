# Cluster Management

First select `Clusters`:

![Sextant Select Clusters](../images/sextant-select-clusters.png){.shadow}

## Add a Cluster

### Step 1

On the `Clusters` page click on the `Add` button top right. This will take you
to the following screen:

![Sextant Add Cluster](../images/sextant-clusters-add.png){.shadow}

### Step 2

Follow the instructions to download and run the `create-service.sh` script
making sure that your `kubectl` context is set to the correct target cluster.
Then run the `get-values.sh` script:

![Sextant Get Values](../images/sextant-clusters-get-values.png){.shadow}

### Step 3

Complete the form choosing a meaningful name and copying the results of Step 2.
In this case we are using `doc-demo-cluster`:

![Sextant Activate Cluster](../images/sextant-clusters-activate.png){.shadow}

### Step 4

Click the `Activate` button and you should see your cluster added to the list of
available target clusters:

![Sextant Cluster Added](../images/sextant-clusters-added.png){.shadow}

## Interact with a Cluster

Once a cluster has been added to the list of target clusters you can interact
with it using the four icons on the right. These allow you to:

- [Deactivate a Cluster](#deactivate-a-cluster)
- [Edit a Cluster](#edit-a-cluster)
- [View a Cluster](#view-a-cluster)
- [View a Cluster's Deployments](#view-a-clusters-deployments)

### Deactivate a Cluster

![Sextant Cluster Deactivate](../images/sextant-clusters-deactivate.png){.shadow}

Clicking the `Deactivate` button prompts you to confirm:

![Sextant Cluster Deactivate
Dialog](../images/sextant-clusters-deactivate-dialog.png){.shadow}

!!!Important
    You won't be able to do this if there are deployments associated
    with the target cluster you are trying to deactivate.

Complete this dialog with the correct cluster name:

![Sextant Cluster Deactivate
Confirm](../images/sextant-clusters-deactivate-confirm.png){.shadow}

Clicking `Confirm` completes the deactivation:

![Sextant Cluster Deactivated
Successfully](../images/sextant-clusters-deactivated-successfully.png){.shadow}

!!!Note
    At this point the only option available to you is now `Delete`, which has
    replaced `Deactivate`, and `Edit`.

#### Permanently Delete a Cluster

To permanently delete your cluster select `Delete`:

![Sextant ClusterDelete](../images/sextant-clusters-delete.png){.shadow}

Then complete the dialog with the correct cluster name:

![Sextant Cluster delete Confirm](../images/sextant-clusters-delete-confirm.png){.shadow}

!!!Warning
    Clicking `Confirm` deletes the cluster permanently.

#### Reactivate a Cluster

Alternatively you can select `Edit`:

![Sextant Cluster Edit 2](../images/sextant-clusters-edit-2.png){.shadow}

This takes you to the `Edit` page for this cluster:

![Sextant Cluster Edit Recover](../images/sextant-clusters-edit-recover.png){.shadow}

At this point you can reactivate the cluster simply by hitting `Save` button
without changing anything:

![Sextant Cluster Reactivate](../images/sextant-clusters-edit-reactivated.png){.shadow}

Return to [Interact with a Cluster](#interact-with-a-cluster).

### Edit a Cluster

![Sextant Cluster Edit](../images/sextant-clusters-edit.png){.shadow}

Clicking the `Edit` button presents you with a form where you can, for example,
change the name of the cluster. Here we've changed it to `btp-demo-cluster` and
as a result it has been reactivated under this new name:

![Sextant Cluster Reactivate](../images/sextant-clusters-edit-reactivated.png){.shadow}

Return to [Interact with a Cluster](#interact-with-a-cluster).

### View a Cluster

![Sextant Cluster View](../images/sextant-clusters-view.png){.shadow}

Clicking the `View` button presents you with details of the cluster:

![Sextant Cluster View Cluster](../images/sextant-clusters-view-cluster.png){.shadow}

#### Add a Deployment (Shortcut)

This view also contains a shortcut that lets you `Add` a deployment without
going to the `Deployments` page:

![Sextant Cluster View Cluster Add Shortcut](../images/sextant-clusters-view-cluster-add-shortcut.png){.shadow}

!!!Note
    This effectively takes you straight to create a deployment
    [Step 3](../deployments/management.md#step-3).

#### Audit Trail

However if you scroll down the `View` page for the cluster you can see the audit
trail of all tasks associated with it:

![Sextant Cluster View Audit Trail](../images/sextant-clusters-view-audit-trail.png){.shadow}

Return to [Interact with a Cluster](#interact-with-a-cluster).

### View a Cluster's Deployments

![Sextant Cluster View Deployments](../images/sextant-clusters-view-deployments.png){.shadow}

Clicking the `Deployments` button lists the deployments associated with this
cluster:

![Sextant Cluster List Deployments](../images/sextant-clusters-list-deployments.png){.shadow}

!!!Note
    This is effectively an alternative route to create a deployment
    [Step 2](../deployments/management.md#step-2).

Return to [Interact with a Cluster](#interact-with-a-cluster).
