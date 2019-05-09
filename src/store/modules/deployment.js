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
  // a flag to not trigger any snackbars because
  // tasks have changed - used when we re-filter the list
  ignoreTaskStatus: false,
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
  setIgnoreTaskStatus: (state, action) => {
    state.ignoreTaskStatus = action.payload
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

  update: (id, payload) => axios.put(api.url(`/deployments/${id}`), payload)
    .then(api.process),

  delete: (id) => axios.delete(api.url(`/deployments/${id}`))
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
    dispatch(actions.setShowDeleted(value))
    dispatch(actions.setIgnoreTaskStatus(true))
    dispatch(actions.list())
  },

  // look to see if there have been any task changes to any deployments
  // and trigger a snackbar if there have
  updateDeploymentList: (newData) => (dispatch, getState) => {
    const existingDeployments = selectors.deployment.collection.list(getState())
    const ignoreTaskStatus = selectors.deployment.ignoreTaskStatus(getState())

    if(ignoreTaskStatus) {
      dispatch(actions.setDeployments(newData))
      dispatch(actions.setIgnoreTaskStatus(false))
      return
    }

    // ignore updates if we are loading the first time
    if(existingDeployments.length <= 0) return dispatch(actions.setDeployments(newData))

    const existingMap = existingDeployments.reduce((all, deployment) => {
      all[deployment.id] = deployment
      return all
    }, {})

    const newMap = newData.reduce((all, deployment) => {
      all[deployment.id] = deployment
      return all
    }, {})

    Object.keys(existingMap).forEach(id => {

      // deal with the fact that deleted clusters might not be in the new list
      const newDeployment = newMap[id]
      const oldDeployment = existingMap[id]
      if(!newDeployment && oldDeployment) {
        if(oldDeployment.task.action == 'deployment.delete') {
          dispatch(snackbarActions.setSuccess(`The ${deploymentTaskTitles['deployment.delete']} task succeeded`))
        }
      }

      if(!newDeployment || !oldDeployment) return

      const newTask = newMap[id].task
      const oldTask = existingMap[id].task
      
      if(newTask && oldTask && newTask.status != oldTask.status) {
        const taskTitle = deploymentTaskTitles[newTask.action]
        if(newTask.status == 'error') {
          dispatch(snackbarActions.setError(`The ${taskTitle} task failed`))
        }
        else if(newTask.status == 'finished') {
          dispatch(snackbarActions.setSuccess(`The ${taskTitle} task succeeded`))
        }
      }
    })

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
    try {
      await api.loaderSideEffect({
        dispatch,
        loader: () => loaders.create(cluster, payload),
        prefix,
        name: 'form',
        returnError: true,
      })
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
    try {
      await api.loaderSideEffect({
        dispatch,
        loader: () => loaders.update(id, payload),
        prefix,
        name: 'form',
        returnError: true,
      })
      dispatch(snackbarActions.setInfo(`deployment saving`))
      dispatch(routerActions.navigateTo('deployments'))
    } catch(e) {
      dispatch(snackbarActions.setError(`error saving deployment: ${e.toString()}`))
      console.error(e)
    }
  },
  delete: (id) => async (dispatch, getState) => {
    try {
      const deployment = getState().deployment.deployments.entities.deployment[id]
      await api.loaderSideEffect({
        dispatch,
        loader: () => loaders.delete(id),
        prefix,
        name: 'delete',
        returnError: true,
      })
      if(deployment.status == 'deleted') {
        dispatch(snackbarActions.setSuccess(`deployment deleted`))
      }
      else {
        dispatch(snackbarActions.setInfo(`deployment deleting`))
      }
      dispatch(routerActions.navigateTo('deployments'))
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