import React from 'react'
import { connect } from 'react-redux'

import routerActions from 'store/modules/router'
import selectors from 'store/selectors'

import DeploymentSettingsTabs from 'pages/deployment/DeploymentSettingsTabs'

const onViewPage = (cluster, id, page) => routerActions.navigateTo(`deployment_settings_${page}`, { cluster, id, page })

@connect(
  state => {

    const routeParams = selectors.router.params(state)

    const {
      cluster,
      id,
      page,
    } = routeParams

    return {
      cluster,
      id,
      page,
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