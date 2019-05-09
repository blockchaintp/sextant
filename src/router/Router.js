import React, { Suspense, lazy } from 'react'
import { connect } from 'react-redux'
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'

import selectors from 'store/selectors'
import Loading from 'components/system/Loading'

import LayoutMain from 'containers/Layout'

import Route from './Route'
import RouteContext from './RouteContext'

import NotFound from 'containers/NotFound'
import Login from 'containers/auth/Login'
import AccountDetails from 'containers/auth/AccountDetails'

import CreateInitialUser from 'containers/user/CreateInitialUser'
import UserTable from 'containers/user/UserTable'
import UserForm from 'containers/user/UserForm'

import ClusterTable from 'containers/cluster/ClusterTable'
import ClusterForm from 'containers/cluster/ClusterForm'

import DeploymentTable from 'containers/deployment/DeploymentTable'
import DeploymentForm from 'containers/deployment/DeploymentForm'

@connect(
  state => {
    return {
      userLoaded: selectors.auth.loaded(state),
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
          <Route segment="login" exact>
            <Login />
          </Route>
          <Route segment="create-initial-user" exact>
            <CreateInitialUser />
          </Route>
          <Route segment="users" exact>
            <UserTable />
          </Route>
          <Route segment="user" exact>
            <UserForm />
          </Route>
          <Route segment="accountdetails" exact>
            <AccountDetails />
          </Route>
          <Route segment="clusters" exact>
            <ClusterTable />
          </Route>
          <Route segment="cluster" exact>
            <ClusterForm />
          </Route>
          <Route segment="deployments" exact>
            <DeploymentTable />
          </Route>
          <Route segment="deployment" exact>
            <DeploymentForm />
          </Route>
        </LayoutMain>
      </RouteContext.Provider>
    )
  }
}

export default DragDropContext(HTML5Backend)(Router)