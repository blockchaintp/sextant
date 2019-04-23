import React from 'react'
import { connect } from 'react-redux'

import routerActions from 'store/modules/router'
import clusterActions from 'store/modules/cluster'

import ClusterTable from 'pages/cluster/ClusterTable'
import selectors from 'store/selectors'

const onAdd = (type) => routerActions.navigateTo('cluster', { id: 'new', type })
const onEdit = (id) => routerActions.navigateTo('cluster', { id })
const onDelete = (id) => clusterActions.delete(id)

@connect(
  state => ({
    clusters: selectors.cluster.collection.list(state),
  }),
  {
    onAdd,
    onEdit,
    onDelete,
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