import React from 'react'
import { connect } from 'react-redux'

import routerActions from 'store/modules/router'
import selectors from 'store/selectors'

import DeploymentSettingsTabs from 'pages/deployment/DeploymentSettingsTabs'

const onViewPage = (cluster, id, page) => routerActions.navigateTo(`deployment_settings.${page}`, { cluster, id })

@connect(
  state => {

    const routeParams = selectors.router.params(state)
    const route = selectors.router.route(state)

    const {
      cluster,
      id,
    } = routeParams

    return {
      cluster,
      id,
      route,
    }
  },
  {
    onViewPage,
  },
)
class DeploymentSettingsTabsContainer extends React.Component {

  render() {
    return (
      <DeploymentSettingsTabs 
        {...this.props}
      />
    )
  }
}

export default DeploymentSettingsTabsContainer