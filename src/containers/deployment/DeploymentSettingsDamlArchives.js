import React from 'react'
import { connect } from 'react-redux'

import routerActions from 'store/modules/router'
import deploymentSettingsActions from 'store/modules/deploymentSettings'
import selectors from 'store/selectors'

import DeploymentSettingsDamlArchives from 'pages/deployment/DeploymentSettingsDamlArchives'

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
      damlArchives: selectors.deploymentSettings.damlArchives(state),
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