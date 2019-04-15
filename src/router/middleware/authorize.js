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

  const authorizeSettings = findRoutes(routes, toActivate)
    .map(routeSegment => routeSegment.authorize)
    .filter(authorize => authorize)

  // there are no authorize settings on this route
  if(authorizeSettings.length <= 0) return done()

  const authorizeMap = authorizeSettings.reduce((all, type) => {
    all[type] = true
    return all
  }, {})

  // check there is only a single auth requirement
  if(Object.keys(authorizeMap).length > 1) {
    routeError(`multiple authorize settings found in route`)
    return
  }

  const authorizeSetting = authorizeSettings[0]

  const loggedIn = selectors.user.loggedIn(store.getState())

  if(authorizeSetting == 'user') {
    if(!loggedIn) {
      store.dispatch(routerActions.navigateTo(settings.authRedirects.user))
    }
    else {
      return done()
    }
  }
  else if(authorizeSetting == 'guest') {
    if(loggedIn) {
      store.dispatch(routerActions.navigateTo(settings.authRedirects.guest))
    }
    else {
      return done()
    }
  }
  else {
    routeError(`unknown authorize setting (${authorizeSetting}) found in route`)
    return
  }
}

export default authorizeRoute