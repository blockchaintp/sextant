/* eslint-disable max-len */
import React from 'react'

import MarketplaceGrid from 'components/layout/MarketplaceGrid'

import settings from 'settings'

import rbac from 'utils/rbac'

const AddIcon = settings.icons.add

class MarketplacePage extends React.Component {
  state = {}

  render() {
    const {
      classes,
      onAdd,
      clusterId,
      deploymentForms,
      user,
    } = this.props

    // holds an array of deployment types
    const deploymentList = Object.keys(deploymentForms).map((deploymentType) => {
      const formConfig = deploymentForms[deploymentType]
      // versions is an array of objects.
      // Each object contains data for a version of the deploymentType
      return {
        order: formConfig.order,
        versions: formConfig.button.versions.map((version) => ({
          icon: version.icon,
          title: version.title,
          version: version.version,
          description: version.description,
          handler: () => onAdd(clusterId, deploymentType, version.form),
        })),
      }
    })
    // remove charts that are not helm charts
    const filteredDeployments = deploymentList.filter((item) => item.order >= 0)

    // sort the helm charts based on the order value
    filteredDeployments.sort((a, b) => ((a.order > b.order) ? 1 : -1))

    let addButtonDisabled = true

    if (clusterId !== 'all') {
      const canWriteToCluster = rbac({
        user,
        action: {
          resource_type: 'cluster',
          resource_id: clusterId,
          method: 'write',
        },
      })

      addButtonDisabled = !(canWriteToCluster)
    }

    return (
      <div>
        <MarketplaceGrid
          className={classes.button}
          title="Add"
          icon={AddIcon}
          buttonProps={{
            variant: 'contained',
            color: 'primary',
          }}
          items={filteredDeployments}
          disabled={addButtonDisabled}
        />
      </div>
    )
  }
}

export default MarketplacePage
