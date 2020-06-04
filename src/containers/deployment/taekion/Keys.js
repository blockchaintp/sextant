import React from 'react'
import { connect } from 'react-redux'

import deploymentSettingsActions from 'store/modules/deploymentSettings'
import snackbarActions from 'store/modules/snackbar'
import selectors from 'store/selectors'

import TaekionKeys from 'pages/deployment/taekion/Keys'

@connect(
  state => {

    return {
      
    }
  },
  {
    
  },
)
class TaekionKeysContainer extends React.Component {

  render() {
    return (
      <TaekionKeys 
        {...this.props}
      />
    )
  }
}

export default TaekionKeysContainer