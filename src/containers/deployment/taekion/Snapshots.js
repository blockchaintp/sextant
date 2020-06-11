import React from 'react'
import { connect } from 'react-redux'

import taekionActions from 'store/modules/taekion'
import routerActions from 'store/modules/router'
import selectors from 'store/selectors'

import TaekionSnapshots from 'pages/deployment/taekion/Snapshots'

const changeVolume = (volume, params) => routerActions.navigateTo('deployment_settings.taekionSnapshots', Object.assign({}, params, {
  volume,
}))

@connect(
  state => {
    const params = state.router.route.params

    const {
      cluster,
      id,
      volume,
    } = params

    return {
      cluster,
      deployment: id,
      params,
      volume,
      volumes: selectors.taekion.volumes(state),
      snapshots: selectors.taekion.snapshots(state),
    }
  },
  {
    onChangeVolume: changeVolume,
  },
)
class TaekionSnapshotsContainer extends React.Component {

  render() {
    return (
      <TaekionSnapshots 
        {...this.props}
      />
    )
  }
}

export default TaekionSnapshotsContainer