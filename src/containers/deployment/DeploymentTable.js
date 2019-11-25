import React from 'react'
import { connect } from 'react-redux'

import routerActions from 'store/modules/router'
import deploymentActions from 'store/modules/deployment'

import DeploymentTable from 'pages/deployment/DeploymentTable'
import selectors from 'store/selectors'

const onAdd = (cluster, deployment_type, deployment_version) => routerActions.navigateTo('deployment', { cluster, id: 'new', deployment_type, deployment_version })
const onEdit = (cluster, id) => routerActions.navigateTo('deployment', { cluster, id })
const onViewStatus = (cluster, id) => routerActions.navigateTo('deployment_status', { cluster, id })
const onViewSettings = (cluster, id, deployment_type, deployment_version, pageKey) => {
  if (pageKey) {
    return routerActions.navigateTo(`deployment_settings.${pageKey}`, { cluster, id, deployment_type, deployment_version })
  } else {
    return routerActions.navigateTo('deployment_settings', { cluster, id, deployment_type, deployment_version })
  }
}
const onDelete = (cluster, id) => deploymentActions.delete(cluster, id)
const updatehideDeleted = (value) => deploymentActions.updatehideDeleted(value)
const updateClusterId = (cluster) => routerActions.navigateTo('deployments', { cluster })

@connect(
  state => {
    const clusterId = state.router.route.params.cluster
    const deploymentForms = selectors.config.forms.deployment(state)
    return {
      clusterId,
      clusters: selectors.cluster.collection.list(state),
      cluster: state.cluster.clusters.entities.cluster ? state.cluster.clusters.entities.cluster[clusterId] : null,
      deployments: selectors.deployment.collection.list(state),
      hideDeleted: selectors.deployment.hideDeleted(state),
      deploymentForms,
      user: selectors.auth.data(state),
    }
  },
  {
    onAdd,
    onEdit,
    onViewStatus,
    onViewSettings,
    onDelete,
    updatehideDeleted,
    updateClusterId,
  },
)
class DeploymentTableContainer extends React.Component {

  render() {
    return (
      <DeploymentTable {...this.props} />
    )
  }
}

export default DeploymentTableContainer
