import selectors from 'store/selectors'
import userActions from 'store/modules/user'
import clusterActions from 'store/modules/cluster'
import deploymentActions from 'store/modules/deployment'
import networkActions from 'store/modules/network'

const authHandlers = {
  guest: (state) => selectors.auth.loggedIn(state) ?
    'home' :
    null,
  user: (state) => selectors.auth.loggedIn(state) ?
    null :
    'login',
  superuser: (state) => selectors.auth.isSuperuser(state) ?
    null :
    'home',
}

const routes = [
  {
    name: 'login',
    path: '/login',
    authorize: authHandlers.guest,
  },
  {
    name: 'create-initial-user',
    path: '/create-initial-user',
    authorize: authHandlers.guest,
    redirect: (state) => {
      const hasInitialUser = selectors.user.hasInitialUser(state)

      // if we do have an initial user - we redirect to login
      // if the user is already logged in, the authorize
      // handler on the login route will get the to home
      return hasInitialUser ?
        'login' :
        null
    },
  },
  {
    name: 'home',
    path: '/',
    authorize: authHandlers.user,
    redirect: 'clusters',
  },
  {
    name: 'notfound',
    path: '/notfound',
  },
  {
    name: 'users',
    path: '/users',
    authorize: authHandlers.superuser,
    trigger: {
      activate: (store) => store.dispatch(userActions.list()),
    },
  },
  {
    name: 'user',
    path: '/user/:id',
    authorize: authHandlers.superuser,
    trigger: {
      activate: (store, params) => {
        if(params.id == 'new') return
        store.dispatch(userActions.get(params.id))
      },
    },
  },
  {
    name: 'accountdetails',
    path: '/accountdetails',
    authorize: authHandlers.user,
  },
  {
    name: 'clusters',
    path: '/clusters',
    authorize: authHandlers.user,
    trigger: {
      activate: (store) => store.dispatch(clusterActions.startClusterLoop()),
      deactivate: (store) => store.dispatch(clusterActions.stopClusterLoop()),
    },
  },
  {
    name: 'cluster',
    path: '/cluster/:id',
    authorize: authHandlers.user,
    trigger: {
      activate: (store, params) => {
        if(params.id == 'new') return
        store.dispatch(networkActions.startLoading('cluster.get'))
        store.dispatch(clusterActions.get(params.id))
        store.dispatch(clusterActions.listTasks(params.id))
      },
    },
  },
  {
    name: 'deployments_all',
    path: '/deployments',
    authorize: authHandlers.user,
    trigger: {
      activate: (store) => store.dispatch(deploymentActions.redirectDeployments()),
    },
  },
  {
    name: 'deployments',
    path: '/clusters/:cluster/deployments',
    authorize: authHandlers.user,
    trigger: {
      activate: (store, params) => {
        store.dispatch(clusterActions.list({
          noDeleted: true,
        }))
        store.dispatch(deploymentActions.startDeploymentLoop({
          cluster: params.cluster,
        }))
      },
      deactivate: (store) => store.dispatch(deploymentActions.stopDeploymentLoop()),
    },
  },
  {
    name: 'deployment',
    path: '/clusters/:cluster/deployment/:id',
    authorize: authHandlers.user,
    trigger: {
      activate: (store, params) => {
        if(params.id == 'new') return
        store.dispatch(networkActions.startLoading('deployment.get'))
        store.dispatch(deploymentActions.get(params.cluster, params.id))
        store.dispatch(deploymentActions.listTasks(params.cluster, params.id))
      },
    },
  },
  {
    name: 'deployment_status',
    path: '/clusters/:cluster/deployment/:id/status',
    authorize: authHandlers.user,
    trigger: {
      activate: (store, params) => {
        store.dispatch(networkActions.startLoading('deployment.get'))
        store.dispatch(deploymentActions.get(params.cluster, params.id))
        store.dispatch(deploymentActions.startResourcesLoop({
          cluster: params.cluster,
          deployment: params.id,
        }))
      },
      deactivate: (store) => store.dispatch(deploymentActions.stopResourcesLoop()),
    },
  },
]


export default routes