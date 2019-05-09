import React from 'react'
import { connect } from 'react-redux'

import routerActions from 'store/modules/router'
import deploymentActions from 'store/modules/deployment'

import DeploymentTable from 'pages/deployment/DeploymentTable'
import selectors from 'store/selectors'

const onAdd = (cluster, deployment_type) => routerActions.navigateTo('deployment', { cluster, id: 'new', deployment_type })
const onEdit = (cluster, id) => routerActions.navigateTo('deployment', { cluster, id })
const onDelete = (id) => deploymentActions.delete(id)
const updateShowDeleted = (value) => deploymentActions.updateShowDeleted(value)
const updateClusterId = (cluster) => routerActions.navigateTo('deployments', { cluster })

@connect(
  state => {
    const clusterId = state.router.route.params.cluster
    return {
      clusterId,
      clusters: selectors.cluster.collection.list(state),
      cluster: state.cluster.clusters.entities.cluster ? state.cluster.clusters.entities.cluster[clusterId] : null,
      deployments: selectors.deployment.collection.list(state),
      showDeleted: selectors.deployment.showDeleted(state),
    }
  },
  {
    onAdd,
    onEdit,
    onDelete,
    updateShowDeleted,
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