import React from 'react'
import { connect } from 'react-redux'

import routerActions from 'store/modules/router'
import deploymentSettingsActions from 'store/modules/deploymentSettings'
import selectors from 'store/selectors'

import DeploymentSettingsDamlTimeService from 'pages/deployment/DeploymentSettingsDamlTimeService'

@connect(
  state => {

    const routeParams = selectors.router.params(state)

    const {
      cluster,
      id,
    } = routeParams

    return {
      cluster,
      id,
      damlTimeServiceInfo: selectors.deploymentSettings.damlTimeServiceInfo(state),
    }
  },
  {
    
  },
)
class DeploymentSettingsDamlTimeServiceContainer extends React.Component {

  render() {
    return (
      <DeploymentSettingsDamlTimeService 
        {...this.props}
      />
    )
  }
}

export default DeploymentSettingsDamlTimeServiceContainer