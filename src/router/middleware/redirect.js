import transitionPath from 'router5-transition-path'
import routerActions from 'store/modules/router'
import findRoutes from '../utils/findRoutes'

/*

  if the active route has a redirect property - redirect there

*/
const redirectRoute = (routes) => (router, dependencies) => (toState, fromState, done) => {
  const { toActivate } = transitionPath(toState, fromState)
  const { store } = dependencies

  const activeRoutes = findRoutes(routes, toActivate)
  const activeRoute = activeRoutes[activeRoutes.length - 1]

  if (!activeRoute) return done()

  const redirectInfo = activeRoute.redirect

  if (!redirectInfo) return done()

  let redirectTo = null

  // if the redirect is a string - redirect there
  if (typeof (redirectInfo) === 'string') {
    redirectTo = redirectInfo
  } else if (typeof (redirectInfo) === 'function') {
  // if it's a function - run the function passing the redux state
  // the function should return the redirect or falsey value for don't redirect
    redirectTo = redirectInfo(store.getState())
  } else {
    return done(`unknown type of redirect info: ${typeof (redirectInfo)}`)
  }

  if (redirectTo && redirectTo !== activeRoute.name) {
    store.dispatch(routerActions.navigateTo(redirectTo))
  } else {
    done()
  }
  return undefined
}

export default redirectRoute
