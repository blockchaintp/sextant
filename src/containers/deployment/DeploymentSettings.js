import React from 'react'
import { connect } from 'react-redux'

import routerActions from 'store/modules/router'
import selectors from 'store/selectors'

import DeploymentSettings from 'pages/deployment/DeploymentSettings'
import Loading from 'components/system/Loading'

const onViewPage = (cluster, id, page) => routerActions.navigateTo('deployment_settings', { cluster, id, page })

@connect(
  state => {

    const routeParams = selectors.router.params(state)

    const {
      cluster,
      id,
      page,
    } = routeParams

    const deployment = selectors.deployment.collection.item(state)

    return {
      cluster,
      id,
      page,
      deployment,
      localKeys: selectors.deploymentSettings.localKeyCollection.list(state),
      remoteKeys: selectors.deploymentSettings.remoteKeyCollection.list(state),
    }
  },
  {
    onViewPage,
  },
)
class DeploymentSettingsContainer extends React.Component {

  render() {
    return (
      <DeploymentSettings 
        {...this.props}
      />
    )
  }
}

export default DeploymentSettingsContainer