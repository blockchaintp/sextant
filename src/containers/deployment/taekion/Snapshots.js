import React from 'react'
import { connect } from 'react-redux'

import taekionActions from 'store/modules/taekion'
import selectors from 'store/selectors'

import TaekionSnapshots from 'pages/deployment/taekion/Snapshots'

@connect(
  state => {

    const {
      cluster,
      id,
      volume,
    } = state.router.route.params

    return {
      cluster,
      deployment: id,
      volume,
      volumes: selectors.taekion.volumes(state),
      snapshots: selectors.taekion.snapshots(state),
    }
  },
  {
    
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