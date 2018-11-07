import React from 'react'

import { connectStore } from 'redux-box'
import { connect } from 'react-redux'

/*

  pages
  
*/
import Dashboard from './pages/Dashboard'
import ClusterList from './pages/ClusterList'
import ClusterView from './pages/ClusterView'
import ClusterAddNew from './pages/ClusterAddNew'
import ClusterAddExisting from './pages/ClusterAddExisting'
import UserAddInitial from './pages/UserAddInitial'

/*

  layouts
  
*/
import MainLayout from './layouts/Main'
import AddClusterLayout from './layouts/AddCluster'

/*

  utils
  
*/
import Loading from './components/Loading'
import configModule from './store/config'
import authModule from './store/auth'
import withRouter from './utils/withRouter'

export const routes = {
  'PAGE_HOME': {
    path: '/',
    component: ClusterList,
  },
  'PAGE_CLUSTER_LIST': {
    path: '/clusters',
    component: ClusterList,
  },
  'PAGE_CLUSTER_VIEW': {
    path: '/clusters/view/:name',
    component: ClusterView,
  },
  'PAGE_CLUSTER_ADD_NEW': {
    path: '/clusters/add/new',
    component: ClusterAddNew,
    //pageLayout: AddClusterLayout,
  },
  'PAGE_USER_ADD_INITIAL': {
    path: '/users/initial',
    component: UserAddInitial,
  }
  /*
  'PAGE_CLUSTER_ADD_EXISTING': {
    path: '/clusters/add/existing',
    component: ClusterAddExisting,
    pageLayout: AddClusterLayout,
  },
  */
}

const NotFound = () => (
  <div>not found</div>
)

@connectStore({
  config: configModule,
  auth: authModule,
})
@withRouter()
class AppRouter extends React.Component {

  componentDidMount(){
    this.props.config.loadValues()
    this.props.auth.loadStatus()
  }

  render() {

    const { config, auth, router } = this.props
    const pageName = router.type
    const routeInfo = routes[pageName]
    const Page = routeInfo ? routeInfo.component : NotFound

    const MainLayoutComponent = routeInfo && routeInfo.mainLayout ? routeInfo.mainLayout : MainLayout
    const PageLayout = routeInfo && routeInfo.pageLayout ? routeInfo.pageLayout : null

    if(!config.loaded || !auth.loaded) {
      return (
        <MainLayoutComponent>
          <Loading />
        </MainLayoutComponent>
      )
    }

    return (
      <MainLayoutComponent>
        {
          PageLayout ? (
            <PageLayout>
              <Page />
            </PageLayout>
          ) : (
            <Page />
          )
        }
      </MainLayoutComponent>
    )
  }
}

export default AppRouter