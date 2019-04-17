import selectors from 'store/selectors'
import userActions from 'store/modules/user'


const routes = [
  {
    name: 'login',
    path: '/login',
    authorize: 'guest',
  },
  {
    name: 'create-initial-user',
    path: '/create-initial-user',
    authorize: 'guest',
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
    authorize: 'user',
  },
  {
    name: 'notfound',
    path: '/notfound',
  },
  {
    name: 'users',
    path: '/users',
    authorize: 'user',
    trigger: (store) => store.dispatch(userActions.loadUsers()),
  },
  {
    name: 'user',
    path: '/user/:id',
    authorize: 'user',
    trigger: (store, params) => {
      if(params.id == 'new') return
      store.dispatch(userActions.loadUser(params.id))
    },
  },
]


export default routes