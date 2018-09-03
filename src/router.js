import React from 'react'

import { connectStore } from 'redux-box'
import { connect } from 'react-redux'

/*

  pages
  
*/
import Dashboard from './pages/Dashboard'
import ClusterList from './pages/ClusterList'
import ClusterAddNew from './pages/ClusterAddNew'
import ClusterAddExisting from './pages/ClusterAddExisting'

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
import withRouter from './utils/withRouter'

export const routes = {
  'PAGE_HOME': {
    path: '/',
    component: Dashboard,
  },
  'PAGE_CLUSTER_LIST': {
    path: '/clusters',
    component: ClusterList,
  },
  'PAGE_CLUSTER_ADD_NEW': {
    path: '/clusters/add/new',
    component: ClusterAddNew,
    //pageLayout: AddClusterLayout,
  },
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
})
@withRouter()
class AppRouter extends React.Component {

  componentDidMount(){
    this.props.config.loadValues()
  }

  render() {

    const { config, router } = this.props
    const pageName = router.type
    const routeInfo = routes[pageName]
    const Page = routeInfo ? routeInfo.component : NotFound

    const MainLayoutComponent = routeInfo && routeInfo.mainLayout ? routeInfo.mainLayout : MainLayout
    const PageLayout = routeInfo && routeInfo.pageLayout ? routeInfo.pageLayout : null

    if(!config.loaded) {
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