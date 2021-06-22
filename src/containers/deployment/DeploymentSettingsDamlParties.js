/* eslint-disable max-len */
import React from 'react'
import { connect } from 'react-redux'

import snackbarActions from 'store/modules/snackbar'
import deploymentSettingsActions from 'store/modules/deploymentSettings'
import selectors from 'store/selectors'

import DeploymentSettingsDamlParties from 'pages/deployment/DeploymentSettingsDamlParties'

@connect(
  (state) => {
    const routeParams = selectors.router.params(state)

    const {
      cluster,
      id,
    } = routeParams

    return {
      cluster,
      id,
      keyManagerKeys: selectors.deploymentSettings.keyManagerKeys(state),
      participants: selectors.deploymentSettings.participants(state),
      visibleParticipant: selectors.deploymentSettings.visibleParticipant(state),
      selectedParties: selectors.deploymentSettings.selectedParties(state),
      addPartyWindowOpen: selectors.deploymentSettings.addPartyWindowOpen(state),
      addPartyName: selectors.deploymentSettings.addPartyName(state),
      addPartyIdHint: selectors.deploymentSettings.addPartyIdHint(state),
      addPartyPublicKey: selectors.deploymentSettings.addPartyPublicKey(state),
      tokenWindowOpen: selectors.deploymentSettings.tokenWindowOpen(state),
      tokenSettingsWindowParticipant: selectors.deploymentSettings.tokenSettingsWindowParticipant(state),
      applicationId: selectors.deploymentSettings.applicationId(state),
      tokenValue: selectors.deploymentSettings.tokenValue(state),
    }
  },
  {
    registerParticipant: deploymentSettingsActions.registerParticipant,
    rotateParticipantKey: deploymentSettingsActions.rotateParticipantKey,
    setVisibleParticipant: deploymentSettingsActions.setVisibleParticipant,
    setSelectedParty: deploymentSettingsActions.setSelectedParty,
    setSelectedParties: deploymentSettingsActions.setSelectedParties,
    resetSelectedParties: deploymentSettingsActions.resetSelectedParties,
    addParty: deploymentSettingsActions.addParty,
    removeParties: deploymentSettingsActions.removeParties,
    generatePartyToken: deploymentSettingsActions.generatePartyToken,
    generateAdminToken: deploymentSettingsActions.generateAdminToken,
    setAddPartyWindowOpen: deploymentSettingsActions.setAddPartyWindowOpen,
    setAddPartyName: deploymentSettingsActions.setAddPartyName,
    setAddPartyIdHint: deploymentSettingsActions.setAddPartyIdHint,
    setAddPartyPublicKey: deploymentSettingsActions.setAddPartyPublicKey,
    setToken: deploymentSettingsActions.setToken,
    setTokenWindowOpen: deploymentSettingsActions.setTokenWindowOpen,
    setTokenSettingsWindowParticipant: deploymentSettingsActions.setTokenSettingsWindowParticipant,
    setApplicationId: deploymentSettingsActions.setApplicationId,
    snackbarMessage: snackbarActions.setInfo,
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
