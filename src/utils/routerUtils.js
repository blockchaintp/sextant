/*

  given a route structure with children e.g.

  [
    {
      name: 'home',
      path: '/'
    },
    {
      name: 'login',
      path: '/login',
      apples: 10,
      children: [
        {
          name: 'test',
          path: '/test',
          oranges: 11,
        },
      ],
    },
  ]

  this will find a route based on the given name e.g.

  login.test will return:

  {
    name: 'test',
    path: '/test',
    oranges: 11,
  }

*/

export const findRoute = (routes, name) => {
  if (!name) return null
  return name.split('.').reduce(
    (currentRoute, part) => {
      if (!currentRoute || !currentRoute.children) return null
      return currentRoute.children.find((route) => route.name === part)
    },
    {
      children: routes,
    },
  )
}

export const findRoutes = (routes, names) => names.map((name) => findRoute(routes, name))

// if we are running under a sub-path then prepend that path
// to all the frontend routes
export const processRoutePath = (path) => {
  // if we are not running under a sub-path then just return the route
  if (!window.SEXTANT_ROOT_PATH || window.SEXTANT_ROOT_PATH === '/') return path
  // prepend our sub-path to the route
  return window.SEXTANT_ROOT_PATH + path
}
