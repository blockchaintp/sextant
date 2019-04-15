import { createSelector } from 'reselect'
import routes from 'router/routes'
import findRoute from 'router/utils/findRoute'

// pluck a single prop from a previous selector
const prop = (baseSelector, propName) => createSelector(
  baseSelector,
  data => (data || {})[propName],
)

// return an object of prop selectors given a base selector
// and an array of prop names
const props = (baseSelector, propNames) => propNames.reduce((all, propName) => {
  all[propName] = prop(baseSelector, propName)
  return all
}, {})

const route = state => state.router.route
const previousRoute = state => state.router.previousRoute
const routeParams = prop(route, 'params')
const routeParamId = createSelector(
  routeParams,
  params => params.id,
)

const user = state => state.user
const userErrors = prop(user, 'errors')

const snackbar = state => state.snackbar

const fileupload = state => state.fileupload

const selectors = {

  router: {
    route,

    previousRoute,

    fullRoute: (state) => findRoute(routes, selectors.router.name(state)),

    /*
    
      get the current route name
    
    */
    name: prop(route, 'name'),

    /*
    
      get the current route params
    
    */
    params: routeParams,
    idParam: routeParamId,

    /*
    
      split the current route name by period
      so if the current route name is 'content.books.1'
      it returns ['content', 'books', 1]
    
    */
    segments: createSelector(
      route,
      currentRoute => currentRoute.name.split('.'),
    ),
    /*
    
      get a single segment of the route based on index
      so if the current route name is 'content.books.1'
      index of 1 would return 'books'
    
    */
    segment: (state, index) => selectors.router.segments(state)[index],
    /*
    
      get a single segment of the route that is after the given segment
      so if the current route name is 'content.books.1'
      segment of 'content' would return 'books'
    
    */
    segmentAfter: (state, segment) => {
      const parts = selectors.router.segments(state)
      const segmentIndex = parts.indexOf(segment)
      if(segmentIndex < 0) return null
      return parts[segmentIndex + 1]
    },
  },

  user: {
    store: user,
    loggedIn: createSelector(user, u => u.data ? true : false),
    errors: {
      ...props(userErrors, [
        'login',
        'status',
        'logout',
      ]),
    },
    ...props(user, [
      'data',
      'loaded',
    ]),
  },

  fileupload: {
    store: fileupload,
    ...props(fileupload, [
      'inProgress',
      'status',
      'results',
      'error',
    ]),
  },

  snackbar: {
    store: snackbar,
    ...props(snackbar, [
      'open',
      'text',
      'type',
    ]),
  },

}

export default selectors
