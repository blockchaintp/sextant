import React from 'react'
import { connect } from 'react-redux'

import deploymentSettingsActions from 'store/modules/deploymentSettings'
import snackbarActions from 'store/modules/snackbar'
import selectors from 'store/selectors'

import DeploymentSettingsKeys from 'pages/deployment/DeploymentSettingsKeys'

@connect(
  state => {

    return {
      keyManagerKeys: selectors.deploymentSettings.keyManagerKeys(state),
      enrolledKeys: selectors.deploymentSettings.enrolledKeys(state),
    }
  },
  {
    addEnrolledKey: deploymentSettingsActions.addEnrolledKey,
    snackbarMessage: snackbarActions.setInfo,
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