import React from 'react'
import { connect } from 'react-redux'

import routerActions from 'store/modules/router'
import deploymentSettingsActions from 'store/modules/deploymentSettings'
import selectors from 'store/selectors'

import DeploymentSettingsKeys from 'pages/deployment/DeploymentSettingsKeys'

@connect(
  state => {

    return {
      
    }
  },
  {
    
  },
)
class DeploymentSettingsKeysContainer extends React.Component {

  render() {
    return (
      <DeploymentSettingsKeys 
        {...this.props}
      />
    )
  }
}

export default DeploymentSettingsKeysContainer