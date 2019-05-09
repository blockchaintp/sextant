import React from 'react'
import { connect } from 'react-redux'

import routerActions from 'store/modules/router'
import deploymentActions from 'store/modules/deployment'

import DeploymentTable from 'pages/cluster/DeploymentTable'
import selectors from 'store/selectors'

const onAdd = (deployment_type) => routerActions.navigateTo('deployment', { id: 'new', deployment_type })
const onEdit = (id) => routerActions.navigateTo('deployment', { id })
const onDelete = (id) => deploymentActions.delete(id)
const updateShowDeleted = (value) => deploymentActions.updateShowDeleted(value)

@connect(
  state => ({
    deployments: selectors.deployment.collection.list(state),
    showDeleted: selectors.deployment.showDeleted(state),
  }),
  {
    onAdd,
    onEdit,
    onDelete,
    updateShowDeleted,
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