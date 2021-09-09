import transitionPath from 'router5-transition-path'
import settings from 'settings'
import findRoutes from '../utils/findRoutes'

// log each route transition in development
const logRoute = (routes) => () => (toState, fromState, done) => {
  if (!settings.devMode) return done()
  const { toActivate } = transitionPath(toState, fromState)
  const activeRoutes = findRoutes(routes, toActivate)
  console.log('route:', activeRoutes)
  return done()
}

export default logRoute
