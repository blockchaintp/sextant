import transitionPath from 'router5-transition-path'
import { findRoutes } from '../../utils/routerUtils'

const runTriggers = ({
  routes,
  params,
  store,
  propName,
}) => {
  const allTriggers = routes.reduce((all, route) => {
    const triggers = route.trigger || {}
    const toRun = triggers[propName]
    if (!toRun) return all
    return all.concat(toRun)
  }, [])
  allTriggers.forEach((trigger) => trigger(store, params))
}

/*

  trigger actions when routes become active

*/
const triggerRoute = (routes) => (router, dependencies) => (toState, fromState, done) => {
  const { toActivate, toDeactivate } = transitionPath(toState, fromState)
  const { store } = dependencies
  const { params } = toState

  const activeRoutes = findRoutes(routes, toActivate)
  const deactiveRoutes = findRoutes(routes, toDeactivate)

  runTriggers({
    routes: activeRoutes,
    params,
    store,
    propName: 'activate',
  })

  runTriggers({
    routes: deactiveRoutes,
    params,
    store,
    propName: 'deactivate',
  })

  done()
}

export default triggerRoute
