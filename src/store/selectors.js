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
  if(typeof(propName) == 'string') {
    propName = {
      selectorName: propName,
      dataField: propName,
    }
  }
  all[propName.selectorName] = prop(baseSelector, propName.dataField)
  return all
}, {})

const networkProps = (prefix, fields) => fields.map(field => {
  return {
    selectorName: field,
    dataField: [prefix, field].join('.'),
  }
})

const networkErrors = state => state.network.errors
const networkLoading = state => state.network.loading

const route = state => state.router.route
const previousRoute = state => state.router.previousRoute
const routeParams = prop(route, 'params')
const routeParamId = createSelector(
  routeParams,
  params => params.id,
)

const user = state => state.user

const USER_NETWORK_NAMES = networkProps('user', [
  'status',
  'login',
  'logout',
  'hasInitialUser',
  'create',
])

const config = state => state.config
const forms = createSelector(
  config,
  configState => configState.data.forms || {},
)
const userForms = prop(forms, 'user')

const CONFIG_NETWORK_NAMES = networkProps('config', [
  'data',
])

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
    errors: props(networkErrors, USER_NETWORK_NAMES),
    loading: props(networkLoading, USER_NETWORK_NAMES),
    ...props(user, [
      'data',
      'loaded',
      'hasInitialUser',
    ]),
  },

  config: {
    store: config,
    errors: props(networkErrors, CONFIG_NETWORK_NAMES),
    loading: props(networkLoading, CONFIG_NETWORK_NAMES),
    ...props(config, [
      'data',
    ]),
    forms: {
      user: props(userForms, [
        'initialUser',
        'userAdd',
        'userEdit',
        'userSelf',
        'login',
      ])
    }
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
