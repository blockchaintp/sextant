import React from 'react'
import { connect } from 'react-redux'

import routerActions from 'store/modules/router'
import deploymentSettingsActions from 'store/modules/deploymentSettings'
import selectors from 'store/selectors'

import DeploymentSettingsDamlParties from 'pages/deployment/DeploymentSettingsDamlParties'

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
      keyManagerKeys: selectors.deploymentSettings.keyManagerKeys(state),
      damlParticipants: selectors.deploymentSettings.damlParticipants(state),
      visibleParticipant: selectors.deploymentSettings.visibleParticipant(state),
      selectedParties: selectors.deploymentSettings.selectedParties(state),
    }
  },
  {
    registerParticipant: deploymentSettingsActions.registerParticipant,
    rotateParticipantKey: deploymentSettingsActions.rotateParticipantKey,
    setVisibleParticipant: deploymentSettingsActions.setVisibleParticipant,
    setSelectedParty: deploymentSettingsActions.setSelectedParty,
    setSelectedParties: deploymentSettingsActions.setSelectedParties,
    resetSelectedParties: deploymentSettingsActions.resetSelectedParties,
  },
)
class DeploymentSettingsDamlPartiesContainer extends React.Component {

  render() {
    return (
      <DeploymentSettingsDamlParties 
        {...this.props}
      />
    )
  }
}

export default DeploymentSettingsDamlPartiesContainer