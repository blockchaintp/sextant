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

  const redirects = activeRoutes
    .map(route => route.redirect)
    .filter(r => r)

  // any route in the tree can have a redirect but
  // we only use the lower one
  if(redirects.length <= 0) return done()

  const redirectInfo = redirects[redirects.length-1]

  // if the redirect is a string - redirect there
  if(typeof(redirectInfo) === 'string') {
    store.dispatch(routerActions.navigateTo(redirectInfo))
  }
  // if it's a function - run the function passing the redux state
  // the function should return the redirect or falsey value for don't redirect
  else if(typeof(redirectInfo) === 'function') {
    const redirectTo = redirectInfo(store.getState())
    if(redirectTo) {
      store.dispatch(routerActions.navigateTo(redirectTo)) 
    }
    else {
      done()
    }
  }
  else {
    return done(`unknown type of redirect info: ${typeof(redirectInfo)}`)
  }
}

export default redirectRoute