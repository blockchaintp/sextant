import axios from 'axios'
import { normalize, schema } from 'normalizr'
import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'
import { mergeEntities, mergeAll } from '../utils/mergeNormalized'
import api from '../utils/api'

import selectors from '../selectors'
import routerActions from './router'
import clusterActions from './cluster'
import snackbarActions from './snackbar'

const prefix = 'deployment'

const deployment = new schema.Entity('deployment')
const task = new schema.Entity('task')

const initialState = {
  deployments: normalize([], [deployment]),
  tasks: normalize([], [task]),
  showDeleted: false,

  // a task we are tracking the status of so we show snackbars
  // when it has finished or errored
  trackTask: null,

  loops: {
    deployments: null,
  }
}

const deploymentTaskTitles = {
  'deployment.create': 'deployment create',
  'deployment.update': 'deployment update',
  'deployment.delete': 'deployment delete',
}

const reducers = {
  setDeployments: (state, action) => {
    state.deployments = normalize(action.payload, [deployment])
  },
  setDeployment: (state, action) => {
    mergeEntities(state.deployments, normalize([action.payload], [deployment]))
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
    cluster,
    showDeleted,
  }) => axios.get(api.url(`/clusters/${cluster}/deployments`), {
    params: {
      showDeleted: showDeleted ? 'y' : '',
      withTasks: 'y',
    }
  })
    .then(api.process),

  get: (cluster, id) => axios.get(api.url(`/clusters/${cluster}/deployments/${id}`), {
    params: {
      withTask: 'y',
    }
  })
    .then(api.process),

  create: (cluster, payload) => axios.post(api.url(`/clusters/${cluster}/deployments`), payload)
    .then(api.process),

  update: (cluster, id, payload) => axios.put(api.url(`/clusters/${cluster}/deployments/${id}`), payload)
    .then(api.process),

  delete: (cluster, id) => axios.delete(api.url(`/clusters/${cluster}/deployments/${id}`))
    .then(api.process),

  listTasks: (cluster, id) => axios.get(api.url(`/clusters/${cluster}/deployments/${id}/tasks`))
    .then(api.process),
    
}

const sideEffects = {

  redirectDeployments: () => async (dispatch, getState) => {
    await dispatch(clusterActions.list({
      noDeleted: true,
    }))

    const clusters = selectors.cluster.collection.list(getState())
    const provisioned = clusters.filter(cluster => cluster.status == 'provisioned')

    if(provisioned.length <= 0) return

    const firstCluster = provisioned[0]
    dispatch(routerActions.navigateTo('deployments', { cluster: firstCluster.id }))
  },

  updateShowDeleted: (value) => (dispatch, getState) => {

    const routeParams = selectors.router.params(getState())

    dispatch(actions.setShowDeleted(value))
    dispatch(actions.list({
      cluster: routeParams.cluster
    }))
  },

  // look to see if there have been any task changes to any deployments
  // and trigger a snackbar if there have
  updateDeploymentList: (newData) => (dispatch, getState) => {

    const trackTask = getState().deployment.trackTask

    if(trackTask) {
      const taskTitle = deploymentTaskTitles[trackTask.action]
      const newTrackTask = newData
        .map(deployment => deployment.task)
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
      else if(trackTask.action == 'deployment.delete') {
        dispatch(snackbarActions.setSuccess(`The ${taskTitle} task succeeded`))
        dispatch(actions.setTrackTask(null))
      }
    }

    dispatch(actions.setDeployments(newData))
  },

  list: ({
    cluster,
  }) => (dispatch, getState) => api.loaderSideEffect({
    dispatch,
    loader: () => loaders.list({
      cluster,
      showDeleted: selectors.deployment.showDeleted(getState()),
    }),
    prefix,
    name: 'list',
    dataAction: actions.updateDeploymentList,
    snackbarError: true,
  }),
  get: (cluster, id) => (dispatch) => api.loaderSideEffect({
    dispatch,
    loader: () => loaders.get(cluster, id),
    prefix,
    name: 'get',
    dataAction: actions.setDeployment,
    snackbarError: true,
  }),
  submitForm: (payload) => (dispatch, getState) => {
    const params = selectors.router.params(getState())
    const {
      id,
      cluster,
    } = params
    if(id == 'new') {
      dispatch(actions.create(cluster, payload))
    }
    else {
      dispatch(actions.save(cluster, id, payload))
    }
  },
  create: (cluster, payload) => async (dispatch, getState) => {

    const routeParams = selectors.router.params(getState())

    const {
      deployment_type,
      deployment_version,
    } = routeParams

    const deployment = {
      name: payload.deployment.name,
      deployment_type,
      deployment_version,
      desired_state: payload,
    }

    console.log('--------------------------------------------')
    console.dir(deployment)
    return

    try {
      const task = await api.loaderSideEffect({
        dispatch,
        loader: () => loaders.create(cluster, deployment),
        prefix,
        name: 'form',
        returnError: true,
      })

      dispatch(actions.setTrackTask(task))
      dispatch(snackbarActions.setInfo(`deployment creating`))
      dispatch(routerActions.navigateTo('deployments', {
        cluster,
      }))
    } catch(e) {
      dispatch(snackbarActions.setError(`error creating deployment: ${e.toString()}`))
      console.error(e)
    }
  },
  save: (cluster, id, payload) => async (dispatch, getState) => {

    const deploymentUpdate = {
      name: payload.name,
      desired_state: payload,
    }

    try {
      const task = await api.loaderSideEffect({
        dispatch,
        loader: () => loaders.update(cluster, id, deploymentUpdate),
        prefix,
        name: 'form',
        returnError: true,
      })
      dispatch(actions.setTrackTask(task))
      dispatch(snackbarActions.setInfo(`deployment saving`))
      dispatch(routerActions.navigateTo('deployments', {
        cluster,
      }))
    } catch(e) {
      dispatch(snackbarActions.setError(`error saving deployment: ${e.toString()}`))
      console.error(e)
    }
  },
  delete: (cluster, id) => async (dispatch, getState) => {
    try {
      const deployment = getState().deployment.deployments.entities.deployment[id]
      const task = await api.loaderSideEffect({
        dispatch,
        loader: () => loaders.delete(cluster, id),
        prefix,
        name: 'delete',
        returnError: true,
      })

      // this means we are doing a permenant delete
      if(deployment.status == 'deleted') {
        dispatch(snackbarActions.setSuccess(`deployment deleted`))
      }
      else {
        dispatch(actions.setTrackTask(task))
        dispatch(snackbarActions.setInfo(`deployment deleting`))
      }
      dispatch(routerActions.navigateTo('deployments', {
        cluster,
      }))
    } catch(e) {
      dispatch(snackbarActions.setError(`error deleting deployment: ${e.toString()}`))
      console.error(e)
    }
  },
  listTasks: (cluster, id) => (dispatch) => api.loaderSideEffect({
    dispatch,
    loader: () => loaders.listTasks(cluster, id),
    prefix,
    name: 'listTasks',
    dataAction: actions.setTasks,
    snackbarError: true,
  }),
  startDeploymentLoop: ({
    cluster,
  }) => async (dispatch, getState) => {
    await dispatch(actions.list({
      cluster,
    }))
    const intervalTask = setInterval(() => {
      dispatch(actions.list({
        cluster,
      }))
    }, 1000)
    dispatch(actions.setLoop({
      name: 'deployment',
      value: intervalTask,
    }))
  },
  stopDeploymentLoop: () => (dispatch, getState) => {
    const intervalId = getState().deployment.loops.deployment
    clearInterval(intervalId)
    dispatch(actions.setLoop({
      name: 'deployment',
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