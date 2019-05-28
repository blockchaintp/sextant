import React from 'react'
import { connect } from 'react-redux'

import routerActions from 'store/modules/router'
import deploymentActions from 'store/modules/deployment'
import selectors from 'store/selectors'

import ClusterStatus from 'pages/cluster/ClusterStatus'
import Loading from 'components/system/Loading'

const onCancel = (cluster) => routerActions.navigateTo('clusters')

@connect(
  state => {
    const routeParams = selectors.router.params(state)

    const {
      cluster,
    } = routeParams

    return {
      id: cluster,
      resources: selectors.cluster.resources(state),
      summary: selectors.cluster.summary(state),
      tasks: selectors.cluster.taskCollection.list(state),
      loading: selectors.cluster.loading.get(state),
      deployments: selectors.deployment.collection.list(state),
    }
  },
  {
    onCancel, 
  },
)
class ClusterStatusContainer extends React.Component {

  render() {
    const {
      loading,
    } = this.props

    if(loading) {
      return <Loading />
    }

    return (
      <ClusterStatus 
        {...this.props}
      />
    )
  }
}

export default ClusterStatusContainer