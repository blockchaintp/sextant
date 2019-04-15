import React, { Suspense, lazy } from 'react'
import { connect } from 'react-redux'
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'

import selectors from 'store/selectors'
import Loading from 'components/system/Loading'

import LayoutMain from 'containers/Layout'

import Route from './Route'
import RouteContext from './RouteContext'

import Home from 'containers/Home'
import NotFound from 'containers/NotFound'
import Login from 'containers/auth/Login'

@connect(
  state => {
    return {
      userLoaded: selectors.user.loaded(state),
      route: selectors.router.route(state),
    }
  },
  {

  }
)
class Router extends React.Component {

  render() {
    const {
      userLoaded,
      route,
    } = this.props

    if(!userLoaded || !route) return <Loading />

    return (
      <RouteContext.Provider value={ route.name }>
        <LayoutMain>
          <Route segment="notfound" exact>
            <NotFound />
          </Route>
          <Route segment="home" exact>
            <Home />
          </Route>
          <Route segment="login" exact>
            <Login />
          </Route>
        </LayoutMain>
      </RouteContext.Provider>
    )
  }
}

export default DragDropContext(HTML5Backend)(Router)