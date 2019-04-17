import React from 'react'
import { connect } from 'react-redux'

import selectors from 'store/selectors'
import routerActions from 'store/modules/router'
import userActions from 'store/modules/user'

import settings from 'settings'

import Layout from 'pages/Layout'

@connect(
  state => ({
    title: settings.title,
    loggedIn: selectors.user.loggedIn(state),
    user: selectors.user.data(state),
    isSuperuser: selectors.user.isSuperuser(state),
    isAdmin: selectors.user.isAdmin(state),
  }),
  {
    openPage: routerActions.navigateTo,
    logout: userActions.logout,
  },
)
class LayoutContainer extends React.Component {

  render() {
    const {
      loggedIn,
      logout,
      isSuperuser,
      isAdmin,
    } = this.props

    const sideMenuItems = settings.sideMenu({
      loggedIn,
      isSuperuser,
      isAdmin,
      handlers: {
        logout,
      },
    })

    const appBarMenuItems = settings.appbarMenu({
      loggedIn,
      isSuperuser,
      isAdmin,
      handlers: {
        logout,
      },
    })

    const layoutProps = {
      sideMenuItems,
      appBarMenuItems,
      ...this.props,
    }

    return (
      <Layout {...layoutProps} />
    )    
  }
}

export default LayoutContainer