import selectors from '../store/selectors'

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
]


export default routes