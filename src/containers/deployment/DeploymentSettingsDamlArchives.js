import React from 'react'
import { connect } from 'react-redux'

import routerActions from 'store/modules/router'
import deploymentSettingsActions from 'store/modules/deploymentSettings'
import selectors from 'store/selectors'

import DeploymentSettingsDamlArchives from 'pages/deployment/DeploymentSettingsDamlArchives'

@connect(
  state => {

    return {
      
    }
  },
  {
    
  },
)
class DeploymentSettingsDamlArchivesContainer extends React.Component {

  render() {
    return (
      <DeploymentSettingsDamlArchives 
        {...this.props}
      />
    )
  }
}

export default DeploymentSettingsDamlArchivesContainer