import React from 'react'
import { connect } from 'react-redux'

import selectors from 'store/selectors'
import routerActions from 'store/modules/router'
import authActions from 'store/modules/auth'

import settings from 'settings'

import Layout from 'pages/Layout'

@connect(
  state => ({
    header: settings.edition.header,
    title: settings.title,
    loggedIn: selectors.auth.loggedIn(state),
    user: selectors.auth.data(state),
    isSuperuser: selectors.auth.isSuperuser(state),
    isAdmin: selectors.auth.isAdmin(state),
    globalLoading: state.network.globalLoading,
  }),
  {
    openPage: routerActions.navigateTo,
    logout: authActions.logout,
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
