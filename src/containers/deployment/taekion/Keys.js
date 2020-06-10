import React from 'react'
import { connect } from 'react-redux'

import selectors from 'store/selectors'
import taekionActions from 'store/modules/taekion'
import TaekionKeys from 'pages/deployment/taekion/Keys'

@connect(
  state => {

    const {
      cluster,
      id,
    } = state.router.route.params

    return {
      cluster,
      deployment: id,
      keys: selectors.taekion.keys(state),
      addKeyWindowOpen: selectors.taekion.addKeyWindowOpen(state),
      addKeyResult: selectors.taekion.addKeyResult(state),
      addKeyError: selectors.taekion.errors.createKey(state),
    }
  },
  {
    onOpenAddKeyWindow: () => taekionActions.setAddKeyWindowOpen(true),
    onCloseAddKeyWindow: () => taekionActions.setAddKeyWindowOpen(false),
    onCloseKeyResultWindow: () => taekionActions.setAddKeyResult(null),
    onCreateKey:  taekionActions.createKey,
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