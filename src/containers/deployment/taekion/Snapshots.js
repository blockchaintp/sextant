import React from 'react'
import { connect } from 'react-redux'

import deploymentSettingsActions from 'store/modules/deploymentSettings'
import snackbarActions from 'store/modules/snackbar'
import selectors from 'store/selectors'

import TaekionSnapshots from 'pages/deployment/taekion/Snapshots'

@connect(
  state => {

    return {
      
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