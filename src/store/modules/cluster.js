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
  showDeleted: false,

  // a task we are tracking the status of so we show snackbars
  // when it has finished or errored
  trackTask: null,

  loops: {
    cluster: null,
  }
}

const clusterTaskTitles = {
  'cluster.create': 'cluster create',
  'cluster.update': 'cluster update',
  'cluster.delete': 'cluster delete',
}

const reducers = {
  setClusters: (state, action) => {
    state.clusters = normalize(action.payload, [cluster])
  },
  setCluster: (state, action) => {
    mergeEntities(state.clusters, normalize([action.payload], [cluster]))
  },
  setShowDeleted: (state, action) => {
    state.showDeleted = action.payload
  },
  setTrackTask: (state, action) => {
    state.trackTask = action.payload
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

  list: ({
    showDeleted,
  }) => axios.get(api.url(`/clusters`), {
    params: {
      showDeleted: showDeleted ? 'y' : '',
      withTasks: 'y',
    }
  })
    .then(api.process),

  get: (id) => axios.get(api.url(`/clusters/${id}`), {
    params: {
      withTask: 'y',
    }
  })
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

  updateShowDeleted: (value) => (dispatch, getState) => {
    dispatch(actions.setShowDeleted(value))
    dispatch(actions.list())
  },

  // look to see if there have been any task changes to any clusters
  // and trigger a snackbar if there have
  updateClusterList: (newData) => (dispatch, getState) => {

    const trackTask = getState().cluster.trackTask

    if(trackTask) {
      const taskTitle = clusterTaskTitles[trackTask.action]
      const newTrackTask = newData
        .map(cluster => cluster.task)
        .find(task => task.id == trackTask.id)
      if(newTrackTask) {
        // the tracked task has failed or finished
        if(newTrackTask.status == 'error' || newTrackTask.status == 'finished') {
          if(newTrackTask.status == 'error') {
            dispatch(snackbarActions.setError(`The ${taskTitle} task failed`))
          }
          else if(newTrackTask.status == 'finished') {
            dispatch(snackbarActions.setSuccess(`The ${taskTitle} task succeeded`))
          }
          dispatch(actions.setTrackTask(null))
        }
      }
      else if(trackTask.action == 'cluster.delete') {
        dispatch(snackbarActions.setSuccess(`The ${taskTitle} task succeeded`))
        dispatch(actions.setTrackTask(null))
      }
    }

    dispatch(actions.setClusters(newData))
  },

  list: (opts = {}) => (dispatch, getState) => api.loaderSideEffect({
    dispatch,
    loader: () => loaders.list({
      showDeleted: opts.noDeleted ? false : selectors.cluster.showDeleted(getState()),
    }),
    prefix,
    name: 'list',
    dataAction: actions.updateClusterList,
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
      const task = await api.loaderSideEffect({
        dispatch,
        loader: () => loaders.create(payload),
        prefix,
        name: 'form',
        returnError: true,
      })

      dispatch(actions.setTrackTask(task))
      dispatch(snackbarActions.setInfo(`cluster creating`))
      dispatch(routerActions.navigateTo('clusters'))
    } catch(e) {
      dispatch(snackbarActions.setError(`error creating cluster: ${e.toString()}`))
      console.error(e)
    }
  },
  save: (id, payload) => async (dispatch, getState) => {
    try {
      const task = await api.loaderSideEffect({
        dispatch,
        loader: () => loaders.update(id, payload),
        prefix,
        name: 'form',
        returnError: true,
      })
      dispatch(actions.setTrackTask(task))
      dispatch(snackbarActions.setInfo(`cluster saving`))
      dispatch(routerActions.navigateTo('clusters'))
    } catch(e) {
      dispatch(snackbarActions.setError(`error saving cluster: ${e.toString()}`))
      console.error(e)
    }
  },
  delete: (id) => async (dispatch, getState) => {
    try {
      const cluster = getState().cluster.clusters.entities.cluster[id]
      const task = await api.loaderSideEffect({
        dispatch,
        loader: () => loaders.delete(id),
        prefix,
        name: 'delete',
        returnError: true,
      })
      if(cluster.status == 'deleted') {
        dispatch(snackbarActions.setSuccess(`cluster deleted`))
      }
      else {
        dispatch(actions.setTrackTask(task))
        dispatch(snackbarActions.setInfo(`cluster deleting`))
      }
      dispatch(routerActions.navigateTo('clusters'))
    } catch(e) {
      dispatch(snackbarActions.setError(`error deleting cluster: ${e.toString()}`))
      console.error(e)
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