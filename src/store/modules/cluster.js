import axios from 'axios'
import { normalize, schema } from 'normalizr'
import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'
import { mergeEntities, mergeAll } from '../utils/mergeNormalized'
import api from '../utils/api'

import selectors from '../selectors'
import routerActions from './router'
import snackbarActions from './snackbar'

const prefix = 'cluster'

const cluster = new schema.Entity('cluster')

const initialState = {
  clusters: normalize([], [cluster]),
}

const reducers = {
  setCluster: (state, action) => {
    state.clusters = normalize(action.payload, [cluster])
  },
  setCluster: (state, action) => {
    mergeEntities(state.clusters, normalize([action.payload], [cluster]))
  },
}

const loaders = {

  list: () => axios.get(api.url(`/clusters`))
    .then(api.process),

  get: (id) => axios.get(api.url(`/clusters/${id}`))
    .then(api.process),

  create: (payload) => axios.post(api.url(`/clusters`), payload)
    .then(api.process),

  update: (id, payload) => axios.put(api.url(`/clusters/${id}`), payload)
    .then(api.process),

  delete: (id) => axios.delete(api.url(`/clusters/${id}`))
    .then(api.process),
    
}

const sideEffects = {
  list: () => (dispatch) => api.loaderSideEffect({
    dispatch,
    loader: () => loaders.list(),
    prefix,
    name: 'list',
    dataAction: actions.setClusters,
    snackbarError: true,
  }),
  get: (id) => (dispatch) => api.loaderSideEffect({
    dispatch,
    loader: () => loaders.get(id),
    prefix,
    name: 'get',
    dataAction: actions.setCluster,
    snackbarError: true,
  }),
}

const reducer = CreateReducer({
  initialState,
  reducers,
  prefix,
})

const actions = CreateActions({
  reducers,
  sideEffects,
  prefix,
})

export {
  actions,
  reducer,
}

export default actions