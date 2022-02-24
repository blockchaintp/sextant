/* eslint-disable max-len */
/* eslint-disable camelcase */
import React from 'react'
import { connect } from 'react-redux'

import routerActions from 'store/modules/router'
import MarketplacePage from 'pages/marketplace/Marketplace'
import selectors from 'store/selectors'

const onAdd = (cluster, deployment_type, deployment_version) => routerActions.navigateTo('deployment', {
  cluster, id: 'new', deployment_type, deployment_version,
})

const updateClusterId = (cluster) => routerActions.navigateTo('deployments', { cluster })

@connect(
  (state) => {
    const clusterId = state.router.route.params.cluster
    const deploymentForms = selectors.config.forms.deployment(state)
    return {
      clusterId,
      deploymentForms,
      user: selectors.auth.data(state),
    }
  },
  {
    onAdd,
    updateClusterId,
  },
)
class MarketplaceContainer extends React.Component {
  render() {
    return (
      <MarketplacePage {...this.props} />
    )
  }
}

export default MarketplaceContainer
