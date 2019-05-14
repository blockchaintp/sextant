import React from 'react'
import { connect } from 'react-redux'

import routerActions from 'store/modules/router'
import deploymentActions from 'store/modules/deployment'
import selectors from 'store/selectors'

import DeploymentStatus from 'pages/deployment/DeploymentStatus'
import Loading from 'components/system/Loading'

const onCancel = (cluster) => routerActions.navigateTo('deployments', {cluster})

@connect(
  state => {

    const data = selectors.deployment.collection.item(state)
    const routeParams = selectors.router.params(state)

    const {
      id,
      cluster,
    } = routeParams

    return {
      id,
      clusterId: cluster,
      data,
      loading: selectors.deployment.loading.get(state),
    }
  },
  {
    onCancel, 
  },
)
class DeploymentStatusContainer extends React.Component {

  render() {
    const {
      loading,
    } = this.props

    if(loading) {
      return <Loading />
    }

    return (
      <DeploymentStatus 
        {...this.props}
      />
    )
  }
}

export default DeploymentStatusContainer