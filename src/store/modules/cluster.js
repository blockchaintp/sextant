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
const task = new schema.Entity('task')

const initialState = {
  clusters: normalize([], [cluster]),
  tasks: normalize([], [task]),
  loops: {
    cluster: null,
  }
}

const reducers = {
  setClusters: (state, action) => {
    state.clusters = normalize(action.payload, [cluster])
  },
  setCluster: (state, action) => {
    mergeEntities(state.clusters, normalize([action.payload], [cluster]))
  },
  setTasks: (state, action) => {
    state.tasks = normalize(action.payload, [task])
  },
  setLoop: (state, action) => {
    const {
      name,
      value,
    } = action.payload
    state.loops[name] = value
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

  listTasks: (id) => axios.get(api.url(`/clusters/${id}/tasks`))
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
  submitForm: (payload) => (dispatch, getState) => {
    const id = selectors.router.idParam(getState())
    if(id == 'new') {
      dispatch(actions.create(payload))
    }
    else {
      dispatch(actions.save(id, payload))
    }
  },
  create: (payload) => async (dispatch, getState) => {
    try {    
      await api.loaderSideEffect({
        dispatch,
        loader: () => loaders.create(payload),
        prefix,
        name: 'form',
        returnError: true,
      })
      dispatch(snackbarActions.setSuccess(`cluster created`))
      dispatch(routerActions.navigateTo('clusters'))
    } catch(e) {
      dispatch(snackbarActions.setError(`error creating cluster: ${e.toString()}`))
    }
  },
  save: (id, payload) => async (dispatch, getState) => {
    try {
      await api.loaderSideEffect({
        dispatch,
        loader: () => loaders.update(id, payload),
        prefix,
        name: 'form',
        returnError: true,
      })
      dispatch(snackbarActions.setSuccess(`cluster saved`))
      dispatch(routerActions.navigateTo('clusters'))
    } catch(e) {
      dispatch(snackbarActions.setError(`error saving cluster: ${e.toString()}`))
    }
  },
  listTasks: (id) => (dispatch) => api.loaderSideEffect({
    dispatch,
    loader: () => loaders.listTasks(id),
    prefix,
    name: 'listTasks',
    dataAction: actions.setTasks,
    snackbarError: true,
  }),
  startClusterLoop: () => async (dispatch, getState) => {
    await dispatch(actions.list())
    const intervalTask = setInterval(() => {
      dispatch(actions.list())
    }, 1000)
    dispatch(actions.setLoop({
      name: 'cluster',
      value: intervalTask,
    }))
  },
  stopClusterLoop: () => (dispatch, getState) => {
    const intervalId = getState().cluster.loops.cluster
    clearInterval(intervalId)
    dispatch(actions.setLoop({
      name: 'cluster',
      value: null,
    }))
  },
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