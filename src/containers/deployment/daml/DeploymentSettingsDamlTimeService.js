import React from 'react'
import { connect } from 'react-redux'

import selectors from 'store/selectors'

import DeploymentSettingsDamlTimeService from 'pages/deployment/daml/DeploymentSettingsDamlTimeService'

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
      timeServiceInfo: selectors.deploymentSettings.timeServiceInfo(state),
    }
  },
  {},
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
