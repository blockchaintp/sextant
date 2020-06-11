import React from 'react'
import { connect } from 'react-redux'

import taekionActions from 'store/modules/taekion'
import selectors from 'store/selectors'

import TaekionVolumes from 'pages/deployment/taekion/Volumes'

@connect(
  state => {

    const {
      cluster,
      id,
    } = state.router.route.params

    return {
      cluster,
      deployment: id,
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