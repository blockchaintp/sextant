import React from 'react'
import { connect } from 'react-redux'

import routerActions from 'store/modules/router'
import deploymentSettingsActions from 'store/modules/deploymentSettings'
import selectors from 'store/selectors'

import DeploymentSettings from 'pages/deployment/DeploymentSettings'
import Loading from 'components/system/Loading'

const onViewPage = (cluster, id, page) => routerActions.navigateTo('deployment_settings', { cluster, id, page })

@connect(
  state => {

    const routeParams = selectors.router.params(state)

    const {
      cluster,
      id,
      page,
    } = routeParams

    const deployment = selectors.deployment.collection.item(state)

    return {
      cluster,
      id,
      page,
      deployment,
      localValidatorKeys: selectors.deploymentSettings.localValidatorKeyCollection.list(state),
      localDamlRPCKeys: selectors.deploymentSettings.localDamlRPCKeyCollection.list(state),
      damlParticipants: selectors.deploymentSettings.damlParticipantCollection.list(state),
      remoteKeys: selectors.deploymentSettings.remoteKeyCollection.list(state),
      selectedParties: selectors.deploymentSettings.selectedParties(state),
    }
  },
  {
    onViewPage,
    createRemoteKey: deploymentSettingsActions.createRemoteKey,
    setSelectedParty: deploymentSettingsActions.setSelectedParty,
    registerParticipant: deploymentSettingsActions.registerParticipant,
    rotateLocalDamlRPCKey: deploymentSettingsActions.rotateLocalDamlRPCKey,
  },
)
class DeploymentSettingsContainer extends React.Component {

  render() {
    return (
      <DeploymentSettings 
        {...this.props}
      />
    )
  }
}

export default DeploymentSettingsContainer