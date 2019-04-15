const routes = [
  {
    name: 'login',
    path: '/login',
    authorize: 'guest',
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