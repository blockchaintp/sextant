import transitionPath from 'router5-transition-path'
import findRoutes from '../utils/findRoutes'

import snackbarActions from 'store/modules/snackbar'
import routerActions from 'store/modules/router'
import selectors from 'store/selectors'
import settings from 'settings'

/*

  check the authorize properties of the current routes

  if present - call the checkUser saga with one of the following values:

   * user
   * guest

  the saga will check the status of the current user and if not matching,
  will redirect accordingly

*/
const authorizeRoute = (routes) => (router, dependencies) => (toState, fromState, done) => {
  const { toActivate } = transitionPath(toState, fromState)
  const { store } = dependencies

  const routeError = (message) => {
    console.error(message)
    store.dispatch(snackbarActions.setError(message))
  }

  const authorizeHandlers = findRoutes(routes, toActivate)
    .map(route => route.authorize)
    .filter(authorize => authorize)

  // there are no authorize settings on this route
  if(authorizeHandlers.length <= 0) return done()
  // check there is only a single auth requirement
  if(authorizeHandlers.length > 1) {
    routeError(`multiple authorize settings found in route`)
    return
  }

  const authorizeHandler = authorizeHandlers[0]

  const redirectTo = authorizeHandler(store.getState())

  if(!redirectTo) {
    done()
  }
  else {
    store.dispatch(routerActions.navigateTo(redirectTo))
  }
}

export default authorizeRoute