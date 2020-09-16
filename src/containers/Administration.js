import React from 'react'
import { connect } from 'react-redux'
import administrationActions from 'store/modules/administration'
import selectors from 'store/selectors'

import Restarting from 'components/system/Restarting'
import Administration from '../pages/Administration'

const onRestart = () => administrationActions.restart()

@connect(
  (state) => ({
    restarting: selectors.administration.restarting(state),
  }),
  {
    onRestart,
  },
)
class AdministrationContainer extends React.Component {
  render() {
    const {
      restarting,
    } = this.props

    if (restarting) {
      return <Restarting />
    }

    return (
      <Administration {...this.props} />
    )
  }
}

export default AdministrationContainer
