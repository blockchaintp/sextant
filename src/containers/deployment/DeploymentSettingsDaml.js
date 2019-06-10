import React from 'react'
import { connect } from 'react-redux'

import routerActions from 'store/modules/router'
import deploymentSettingsActions from 'store/modules/deploymentSettings'
import selectors from 'store/selectors'

import DeploymentSettingsDaml from 'pages/deployment/DeploymentSettingsDaml'

@connect(
  state => {

    return {
      
    }
  },
  {
    
  },
)
class DeploymentSettingsDamlContainer extends React.Component {

  render() {
    return (
      <DeploymentSettingsDaml 
        {...this.props}
      />
    )
  }
}

export default DeploymentSettingsDamlContainer