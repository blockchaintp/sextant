import transitionPath from 'router5-transition-path'
import findRoutes from '../utils/findRoutes'

import routerActions from 'store/modules/router'

/*

  if the active route has a redirect property - redirect there

*/
const redirectRoute = (routes) => (router, dependencies) => (toState, fromState, done) => {
  const { toActivate } = transitionPath(toState, fromState)
  const { store } = dependencies

  const activeRoutes = findRoutes(routes, toActivate)

  const activeRoute = activeRoutes[activeRoutes.length - 1]

  if(!activeRoute || !activeRoute.redirect) return done()

  store.dispatch(routerActions.navigateTo(activeRoute.redirect))
}

export default redirectRoute