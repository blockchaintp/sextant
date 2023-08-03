import React from 'react'
import { connect } from 'react-redux'

import routerActions from 'store/modules/router'
import selectors from 'store/selectors'

import Loading from 'components/system/Loading'
// import ChronicleExplorer from 'pages/deployment/chronicle/Explorer'
import Playground from 'pages/deployment/chronicle/Playground'

const onCancel = (cluster) => routerActions.navigateTo('deployments', { cluster })
@connect(
  (state) => {
    const routeParams = selectors.router.params(state)

    const {
      id,
      cluster,
    } = routeParams

    return {
      id,
      clusterId: cluster,
      deployment: selectors.deployment.collection.item(state),
      // resources: selectors.deployment.resources(state),
      // summary: selectors.deployment.summary(state),
      // tasks: selectors.deployment.taskCollection.list(state),
      // loading: selectors.deployment.loading.get(state),
    }
  },
  {
    onCancel,
  },
)
class DeploymentChronicleContainer extends React.Component {
  render() {
    const {
      loading,
    } = this.props

    if (loading) {
      return <Loading />
    }

    return (
      <Playground
        {...this.props}
      />
    )
  }
}

export default DeploymentChronicleContainer
