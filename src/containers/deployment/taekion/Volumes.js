import React from 'react'
import { connect } from 'react-redux'

import taekionActions from 'store/modules/taekion'
import routerActions from 'store/modules/router'
import selectors from 'store/selectors'

import TaekionVolumes from 'pages/deployment/taekion/Volumes'

const viewSnapshots = (volume, params) => routerActions.navigateTo('deployment_settings.taekionSnapshots', Object.assign({}, params, {
  volume,
}))

const createSnapshot = (volume, params) => routerActions.navigateTo('deployment_settings.taekionSnapshots', Object.assign({}, params, {
  volume,
  create: 'yes',
}))

@connect(
  state => {

    const params = state.router.route.params

    const {
      cluster,
      id,
    } = params

    return {
      cluster,
      deployment: id,
      params,
      volumes: selectors.taekion.volumes(state),
      keys: selectors.taekion.keys(state),
      addVolumeWindowOpen: selectors.taekion.addVolumeWindowOpen(state),
      addVolumeError: selectors.taekion.errors.createVolume(state),
    }
  },
  {
    onOpenAddVolumeWindow: () => taekionActions.setAddVolumeWindowOpen(true),
    onCloseAddVolumeWindow: () => taekionActions.setAddVolumeWindowOpen(false),
    onCreateVolume:  taekionActions.createVolume,
    onDeleteVolume:  taekionActions.deleteVolume,
    onViewSnapshots: viewSnapshots,
    onCreateSnapshot: createSnapshot,
  },
)
class TaekionVolumesContainer extends React.Component {

  render() {
    return (
      <TaekionVolumes 
        {...this.props}
      />
    )
  }
}

export default TaekionVolumesContainer