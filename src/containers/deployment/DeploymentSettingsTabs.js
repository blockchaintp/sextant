/* eslint-disable camelcase */
import React from 'react'
import { connect } from 'react-redux'

import routerActions from 'store/modules/router'
import selectors from 'store/selectors'

import DeploymentSettingsTabs from 'pages/deployment/DeploymentSettingsTabs'

const onViewPage = (cluster, id, deployment_type, deployment_version, page, params = {}) => routerActions.navigateTo(`deployment_settings.${page}`, {
  cluster, id, deployment_type, deployment_version, ...params,
})

@connect(
  (state) => {
    const routeParams = selectors.router.params(state)
    const route = selectors.router.route(state)

    const deploymentForms = selectors.config.forms.deployment(state)
    const {
      cluster,
      id,
      deployment_type,
      deployment_version,
    } = routeParams

    const { versions } = deploymentForms[deployment_type].button

    const { features } = versions.find((item) => (item.form === deployment_version))

    return {
      cluster,
      id,
      features,
      deployment_type,
      deployment_version,
      route,
    }
  },
  {
    onViewPage,
  },
)
class DeploymentSettingsTabsContainer extends React.Component {
  render() {
    return (
      <DeploymentSettingsTabs
        {...this.props}
      />
    )
  }
}

export default DeploymentSettingsTabsContainer
