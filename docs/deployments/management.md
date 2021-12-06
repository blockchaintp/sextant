# Deployment Management

First select `Deployments`:

![Sextant Select Deployments](../images/sextant-select-deployments.png)

There are four basic management operations that apply to all deployments.

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

- [Hyperledger Sawtooth](dlts/sawtooth.md)
- [Hyperledger Besu](dlts/besu.md)

The current _smart contract_ deployment options are -

- [Daml on Sawtooth](smart-contracts/daml-on-sawtooth.md)
- [Daml on Besu](smart-contracts/daml-on-besu.md)
- [Daml on QLDB](smart-contracts/daml-on-qldb.md)
- [Daml on Postgres](smart-contracts/daml-on-postgres.md)

The current _information security_ options are -

- [TFS on Sawtooth](infosec/tfs-on-sawtooth.md)

In addition to these core deployments the dropdown menu includes some utility
deployments. These are documented [here](../topics/utility-deployments.md).

## Edit a Deployment

// TODO - Text and graphics here

## Undeploy a Deployment

// TODO - Text and graphics here

## Delete a Deployment

// TODO - Text and graphics here
