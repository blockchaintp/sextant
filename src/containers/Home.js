import React from 'react'
import { connect } from 'react-redux'

import routerActions from 'store/modules/router'
import selectors from 'store/selectors'

import Home from 'pages/Home'

@connect(
  state => ({
    
  }),
  {
    navigateTo: routerActions.navigateTo,
  },
)
class HomeContainer extends React.Component {
  render() {
    return (
      <Home {...this.props} />
    )    
  }
}

export default HomeContainer