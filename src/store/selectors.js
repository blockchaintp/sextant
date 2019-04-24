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

const entity = ({
  baseSelector,
  entityName,
}) => {
  const entities = createSelector(
    baseSelector,
    baseStore => baseStore.entities[entityName] || {},
  )
  const ids = createSelector(
    baseSelector,
    baseStore => baseStore.result || [],
  )
  const list = createSelector(
    entities,
    ids,
    (entities, ids) => ids.map(id => entities[id])
  )
  const item = createSelector(
    entities,
    routeParamId,
    (entities, id) => {
      return id == 'new' ?
        {} :
        entities[id]
    },
  )

  return {
    entities,
    ids,
    list,
    item,
  }
}

const networkErrors = state => state.network.errors
const networkLoading = state => state.network.loading

const route = state => state.router.route
const previousRoute = state => state.router.previousRoute
const routeParams = prop(route, 'params')
const routeName = prop(route, 'name')
const routeParamId = createSelector(
  routeParams,
  params => params.id,
)
const routeSegments = createSelector(
  routeName,
  name => name.split('.'),
)

const authStore = state => state.auth
const authData = prop(authStore, 'data')

const AUTH_NETWORK_NAMES = networkProps('auth', [
  'status',
  'login',
  'logout',
])

const userStore = state => state.user

const USER_NETWORK_NAMES = networkProps('user', [
  'hasInitialUser',
  'form',
  'list',
  'get',
])

const clusterStore = state => state.cluster

const CLUSTER_NETWORK_NAMES = networkProps('cluster', [
  'form',
  'list',
  'get',
])

const configStore = state => state.config
const configData = prop(configStore, 'data')
const forms = createSelector(
  configData,
  configData => configData.forms || {},
)
const userForms = prop(forms, 'user')
const clusterForms = prop(forms, 'cluster')

const userAccessLevels = prop(configData, 'userAccessLevels')
const roleAccessLevels = prop(configData, 'roleAccessLevels')

const userAccessFilter = (type) => createSelector(
  authData,
  userAccessLevels,
  (authData, userAccessLevels) => {
    if(!authData) return false
    return userAccessLevels[authData.permission] >= userAccessLevels[type]
  },
)

const CONFIG_NETWORK_NAMES = networkProps('config', [
  'data',
])

const snackbarStore = state => state.snackbar

const fileuploadStore = state => state.fileupload

const selectors = {

  router: {
    route,

    previousRoute,

    fullRoute: (state) => findRoute(routes, routeName(state)),

    /*
    
      get the current route name
    
    */
    name: routeName,

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
    segments: routeSegments,
    /*
    
      get a single segment of the route based on index
      so if the current route name is 'content.books.1'
      index of 1 would return 'books'
    
    */
    segment: (state, index) => routeSegments(state)[index],
    /*
    
      get a single segment of the route that is after the given segment
      so if the current route name is 'content.books.1'
      segment of 'content' would return 'books'
    
    */
    segmentAfter: (state, segment) => {
      const parts = routeSegments(state)
      const segmentIndex = parts.indexOf(segment)
      if(segmentIndex < 0) return null
      return parts[segmentIndex + 1]
    },
  },

  auth: {
    store: authStore,
    data: authData,
    loggedIn: createSelector(authData, data => data ? true : false),
    errors: props(networkErrors, AUTH_NETWORK_NAMES),
    loading: props(networkLoading, AUTH_NETWORK_NAMES),
    isSuperuser: userAccessFilter('superuser'),
    isAdmin: userAccessFilter('admin'),
    ...props(authStore, [
      'loaded',
    ]),
  },

  user: {
    store: userStore,
    errors: props(networkErrors, USER_NETWORK_NAMES),
    loading: props(networkLoading, USER_NETWORK_NAMES),
    collection: entity({
      baseSelector: prop(userStore, 'users'),
      entityName: 'user',
    }),
    ...props(userStore, [
      'hasInitialUser',
    ]),
  },

  cluster: {
    store: clusterStore,
    errors: props(networkErrors, CLUSTER_NETWORK_NAMES),
    loading: props(networkLoading, CLUSTER_NETWORK_NAMES),
    collection: entity({
      baseSelector: prop(clusterStore, 'clusters'),
      entityName: 'cluster',
    }),
  },

  config: {
    store: configStore,
    errors: props(networkErrors, CONFIG_NETWORK_NAMES),
    loading: props(networkLoading, CONFIG_NETWORK_NAMES),
    ...props(configStore, [
      'data',
    ]),
    forms: {
      user: props(userForms, [
        'initialUser',
        'userAdd',
        'userEdit',
        'userSelf',
        'login',
      ]),
      cluster: props(clusterForms, [
        'local',
        'remote',
      ])
    },
    userAccessLevels,
    roleAccessLevels,
  },

  fileupload: {
    store: fileuploadStore,
    ...props(fileuploadStore, [
      'inProgress',
      'status',
      'results',
      'error',
    ]),
  },

  snackbar: {
    store: snackbarStore,
    ...props(snackbarStore, [
      'open',
      'text',
      'type',
    ]),
  },

}

export default selectors
