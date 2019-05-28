import React from 'react'
import { connect } from 'react-redux'

import routerActions from 'store/modules/router'
import clusterActions from 'store/modules/cluster'

import ClusterTable from 'pages/cluster/ClusterTable'
import selectors from 'store/selectors'

const viewDeployments = (id) => routerActions.navigateTo('deployments', { cluster: id })
const onViewStatus = (id) => routerActions.navigateTo('cluster_status', { id })
const onAdd = (provision_type) => routerActions.navigateTo('cluster', { id: 'new', provision_type })
const onEdit = (id) => routerActions.navigateTo('cluster', { id })
const onDelete = (id) => clusterActions.delete(id)
const updateShowDeleted = (value) => clusterActions.updateShowDeleted(value)

@connect(
  state => ({
    clusters: selectors.cluster.collection.list(state),
    showDeleted: selectors.cluster.showDeleted(state),
  }),
  {
    onAdd,
    onEdit,
    onDelete,
    updateShowDeleted,
    viewDeployments,
    onViewStatus,
  },
)
class ClusterTableContainer extends React.Component {

  render() {
    return (
      <ClusterTable {...this.props} />
    )    
  }
}

export default ClusterTableContainer