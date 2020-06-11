import React from 'react'
import { connect } from 'react-redux'

import deploymentSettingsActions from 'store/modules/deploymentSettings'
import snackbarActions from 'store/modules/snackbar'
import selectors from 'store/selectors'

import TaekionVolumes from 'pages/deployment/taekion/Volumes'

@connect(
  state => {

    return {}
  },
  {
    
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