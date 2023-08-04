import React from 'react'
import { connect } from 'react-redux'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

import selectors from 'store/selectors'
import Loading from 'components/system/Loading'

import LayoutMain from 'containers/Layout'

import NotFound from 'containers/NotFound'
import Login from 'containers/auth/Login'
import AccountDetails from 'containers/auth/AccountDetails'

import CreateInitialUser from 'containers/user/CreateInitialUser'
import UserTable from 'containers/user/UserTable'
import UserForm from 'containers/user/UserForm'
import AccessToken from 'containers/user/AccessToken'

import ClusterTable from 'containers/cluster/ClusterTable'
import ClusterForm from 'containers/cluster/ClusterForm'
import ClusterStatus from 'containers/cluster/ClusterStatus'

import Marketplace from 'containers/marketplace/MarketplaceContainer'

import DeploymentTable from 'containers/deployment/DeploymentTable'
import DeploymentForm from 'containers/deployment/DeploymentForm'
import DeploymentStatus from 'containers/deployment/DeploymentStatus'

import DeploymentSettingsTabs from 'containers/deployment/DeploymentSettingsTabs'
import DeploymentSettingsKeys from 'containers/deployment/DeploymentSettingsKeys'
import DeploymentSettingsDamlParties from 'containers/deployment/daml/DeploymentSettingsDamlParties'
import DeploymentSettingsDamlArchives from 'containers/deployment/daml/DeploymentSettingsDamlArchives'
import DeploymentSettingsDamlTimeService from 'containers/deployment/daml/DeploymentSettingsDamlTimeService'

import DeploymentSettingsTaekionCli from 'containers/deployment/taekion/Cli'
import DeploymentSettingsTaekionKeys from 'containers/deployment/taekion/Keys'
import DeploymentSettingsTaekionVolumes from 'containers/deployment/taekion/Volumes'
import DeploymentSettingsTaekionSnapshots from 'containers/deployment/taekion/Snapshots'
import DeploymentSettingsTaekionExplorer from 'pages/deployment/taekion/Explorer'

import DeploymentChronicle from 'containers/deployment/chronicle/Chronicle'

import Administration from '../containers/Administration'

import Route from './Route'
import RouteContext from './RouteContext'

@connect(
  (state) => ({
    userLoaded: selectors.auth.loaded(state),
    route: selectors.router.route(state),
  }),
  {

  },
)
class Router extends React.Component {
  render() {
    const {
      userLoaded,
      route,
    } = this.props

    if (!userLoaded || !route) return <Loading />

    return (
      <DndProvider backend={HTML5Backend}>
        <RouteContext.Provider value={route.name}>
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
            <Route segment="accesstoken" exact>
              <AccessToken />
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
            <Route segment="marketplace" exact>
              <Marketplace />
            </Route>
            <Route segment="cluster_status" exact>
              <ClusterStatus />
            </Route>
            <Route segment="deployments" exact>
              <DeploymentTable />
            </Route>
            <Route segment="deployment" exact>
              <DeploymentForm />
            </Route>
            <Route segment="deployment_status" exact>
              <DeploymentStatus />
            </Route>
            <Route segment="deployment_settings">
              <DeploymentSettingsTabs>
                <Route segment="keys" exact>
                  <DeploymentSettingsKeys />
                </Route>
                <Route segment="damlParties" exact>
                  <DeploymentSettingsDamlParties />
                </Route>
                <Route segment="damlArchives" exact>
                  <DeploymentSettingsDamlArchives />
                </Route>
                <Route segment="damlTimeService" exact>
                  <DeploymentSettingsDamlTimeService />
                </Route>
                <Route segment="taekionCli" exact>
                  <DeploymentSettingsTaekionCli />
                </Route>
                <Route segment="taekionKeys" exact>
                  <DeploymentSettingsTaekionKeys />
                </Route>
                <Route segment="taekionVolumes" exact>
                  <DeploymentSettingsTaekionVolumes />
                </Route>
                <Route segment="taekionSnapshots" exact>
                  <DeploymentSettingsTaekionSnapshots />
                </Route>
                <Route segment="taekionExplorer" exact>
                  <DeploymentSettingsTaekionExplorer />
                </Route>
              </DeploymentSettingsTabs>
            </Route>
            <Route segment="chronicle">
              <DeploymentChronicle />
            </Route>
            <Route segment="administration" exact>
              <Administration />
            </Route>
          </LayoutMain>
        </RouteContext.Provider>
      </DndProvider>
    )
  }
}

export default Router
