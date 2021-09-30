import React from 'react'
import { connect } from 'react-redux'

import snackbarActions from 'store/modules/snackbar'
import selectors from 'store/selectors'
import TaekionCli from 'pages/deployment/taekion/Cli'

@connect(
  (state) => {
    const {
      cluster,
      id,
    } = state.router.route.params

    return {
      cluster,
      deployment: id,
      accessToken: selectors.user.accessToken(state),
    }
  },
  {
    snackbarMessage: snackbarActions.setInfo,
  },
)
class TaekionCliContainer extends React.Component {
  render() {
    return (
      <TaekionCli
        {...this.props}
      />
    )
  }
}

export default TaekionCliContainer
