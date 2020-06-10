import React from 'react'
import { connect } from 'react-redux'

import selectors from 'store/selectors'
import taekionActions from 'store/modules/taekion'
import TaekionKeys from 'pages/deployment/taekion/Keys'

@connect(
  state => {

    return {
      keys: selectors.taekion.keys(state),
      addKeyWindowOpen: selectors.taekion.addKeyWindowOpen(state),
    }
  },
  {
    onOpenAddKeyWindow: () => taekionActions.setAddKeyWindowOpen(true),
    onCloseAddKeyWindow: () => taekionActions.setAddKeyWindowOpen(false),
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