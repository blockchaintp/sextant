import selectors from 'store/selectors'
import userActions from 'store/modules/user'

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
    trigger: (store) => store.dispatch(userActions.loadUsers()),
  },
  {
    name: 'user',
    path: '/user/:id',
    authorize: authHandlers.superuser,
    trigger: (store, params) => {
      if(params.id == 'new') return
      store.dispatch(userActions.loadUser(params.id))
    },
  },
]


export default routes