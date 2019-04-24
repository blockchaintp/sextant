import selectors from 'store/selectors'
import userActions from 'store/modules/user'
import clusterActions from 'store/modules/cluster'
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
  },
  {
    name: 'notfound',
    path: '/notfound',
  },
  {
    name: 'users',
    path: '/users',
    authorize: authHandlers.superuser,
    trigger: (store) => store.dispatch(userActions.list()),
  },
  {
    name: 'user',
    path: '/user/:id',
    authorize: authHandlers.superuser,
    trigger: (store, params) => {
      if(params.id == 'new') return
      store.dispatch(userActions.get(params.id))
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
    trigger: (store) => store.dispatch(clusterActions.list()),
  },
  {
    name: 'cluster',
    path: '/cluster/:id',
    authorize: authHandlers.user,
    trigger: (store, params) => {
      if(params.id == 'new') return
      store.dispatch(networkActions.startLoading('cluster.get'))
      store.dispatch(clusterActions.get(params.id))
      store.dispatch(clusterActions.listTasks(params.id))
    },
  },
]


export default routes