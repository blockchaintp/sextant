import React from 'react'
import { connect } from 'react-redux'

import routerActions from 'store/modules/router'
import deploymentSettingsActions from 'store/modules/deploymentSettings'
import selectors from 'store/selectors'

import DeploymentSettingsDamlTimeService from 'pages/deployment/DeploymentSettingsDamlTimeService'

@connect(
  state => {

    return {
      
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