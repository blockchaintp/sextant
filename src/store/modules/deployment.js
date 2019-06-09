import axios from 'axios'
import dotty from 'dotty'
import { normalize, schema } from 'normalizr'
import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'
import { mergeEntities, mergeAll } from '../utils/mergeNormalized'
import api from '../utils/api'

import selectors from '../selectors'
import routerActions from './router'
import clusterActions from './cluster'
import userActions from './user'
import snackbarActions from './snackbar'

const prefix = 'deployment'

const deployment = new schema.Entity('deployment')
const task = new schema.Entity('task')
const role = new schema.Entity('role')

const initialState = {
  deployments: normalize([], [deployment]),
  tasks: normalize([], [task]),
  roles: normalize([], [role]),
  resources: {
    pods: [],
    services: [],
    volumes: [],
  },
  summary: [],
  showDeleted: false,

  // a task we are tracking the status of so we show snackbars
  // when it has finished or errored
  trackTask: null,

  // are we looping for the following endpoints?
  loops: {
    deployments: null,
    resources: null,
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
  setRoles: (state, action) => {
    state.roles = normalize(action.payload, [role])
  },
  resetRoles: (state, action) => {
    state.roles = normalize([], [role])
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
  setResources: (state, action) => {
    state.resources = action.payload
  },
  setSummary: (state, action) => {
    state.summary = action.payload
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

  listRoles: (cluster, id) => axios.get(api.url(`/clusters/${cluster}/deployments/${id}/roles`))
    .then(api.process),

  create: (cluster, payload) => axios.post(api.url(`/clusters/${cluster}/deployments`), payload)
    .then(api.process),

  update: (cluster, id, payload) => axios.put(api.url(`/clusters/${cluster}/deployments/${id}`), payload)
    .then(api.process),

  delete: (cluster, id) => axios.delete(api.url(`/clusters/${cluster}/deployments/${id}`))
    .then(api.process),

  listTasks: (cluster, id) => axios.get(api.url(`/clusters/${cluster}/deployments/${id}/tasks`))
    .then(api.process),
  
  listResources: (cluster, id) => axios.get(api.url(`/clusters/${cluster}/deployments/${id}/resources`))
    .then(api.process),

  getSummary: (cluster, id) => axios.get(api.url(`/clusters/${cluster}/deployments/${id}/summary`))
    .then(api.process),

  createRole: (cluster, id, payload) => axios.post(api.url(`/clusters/${cluster}/deployments/${id}/roles`), payload)
    .then(api.process),

  deleteRole: (cluster, id, userid) => axios.delete(api.url(`/clusters/${cluster}/deployments/${id}/roles/${userid}`))
    .then(api.process),
    
}

const sideEffects = {

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
  listRoles: (cluster, id) => async (dispatch) => {
    if(id == 'new') {
      dispatch(actions.resetRoles())
      return
    }
    await api.loaderSideEffect({
      dispatch,
      loader: () => loaders.listRoles(cluster, id),
      prefix,
      name: 'listRoles',
      dataAction: actions.setRoles,
      snackbarError: true,
    })
  },
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

      const routeParams = selectors.router.params(getState())
      const deploymentForms = selectors.config.forms.deployment(getState())

      const {
        deployment_type,
        deployment_version,
      } = routeParams

      const paths = deploymentForms[deployment_type].paths[deployment_version]

      if(!paths || !paths.name) throw new Error(`cannot find name path for deployment: ${deployment_type} ${deployment_version}`)

      const name = dotty.get(payload, paths.name)

      const deployment = {
        name,
        deployment_type,
        deployment_version,
        desired_state: payload,
      }
      
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
    try {
      const existingValues = selectors.deployment.collection.item(state)

      const {
        deployment_type,
        deployment_version,
      } = existingValues

      const paths = deploymentForms[deployment_type].paths[deployment_version]

      if(!paths || !paths.name) throw new Error(`cannot find name path for deployment: ${deployment_type} ${deployment_version}`)

      const name = dotty.get(payload, paths.name)

      const deploymentUpdate = {
        name,
        desired_state: payload,
      }

      console.log('--------------------------------------------')
      console.dir(deploymentUpdate)
      return

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
  listResources: (cluster, id) => (dispatch) => {
    return api.loaderSideEffect({
      dispatch,
      loader: () => loaders.listResources(cluster, id),
      prefix,
      name: 'listResources',
      dataAction: actions.setResources,
      snackbarError: true,
    })
  },
  getSummary: (cluster, id) => (dispatch) => {
    return api.loaderSideEffect({
      dispatch,
      loader: () => loaders.getSummary(cluster, id),
      prefix,
      name: 'getSummary',
      dataAction: actions.setSummary,
      snackbarError: true,
    })
  },
  startDeploymentLoop: ({
    cluster,
  }) => async (dispatch, getState) => {
    dispatch(actions.setLoop({
      name: 'deployment',
      value: true,
    }))
    dispatch(actions.deploymentLoop({
      cluster,
    }))    
  },
  deploymentLoop: ({
    cluster,
  }) => async (dispatch, getState) => {
    const looping = getState().deployment.loops.deployment
    if(!looping) return
    await dispatch(actions.list({
      cluster,
    }))
    await new Promise(resolve => setTimeout(resolve, 1000))
    dispatch(actions.deploymentLoop({
      cluster,
    }))
  },
  stopDeploymentLoop: () => (dispatch, getState) => {
    dispatch(actions.setLoop({
      name: 'deployment',
      value: false,
    }))
  },
  startResourcesLoop: ({
    cluster,
    deployment,
  }) => async (dispatch, getState) => {
    dispatch(actions.setLoop({
      name: 'resources',
      value: true,
    }))
    dispatch(actions.resourcesLoop({
      cluster,
      deployment,
    }))
  },
  resourcesLoop: ({
    cluster,
    deployment,
  }) => async (dispatch, getState) => {
    const looping = getState().deployment.loops.resources
    if(!looping) return
    await dispatch(actions.listResources(cluster, deployment))
    await new Promise(resolve => setTimeout(resolve, 1000))
    dispatch(actions.resourcesLoop({
      cluster,
      deployment,
    }))
  },
  stopResourcesLoop: () => (dispatch, getState) => {
    dispatch(actions.setLoop({
      name: 'resources',
      value: false,
    }))
  },
  addRole: () => async (dispatch, getState) => {
    const params = selectors.router.params(getState())  
    const {
      cluster,
      id,
    } = params
    const username = selectors.user.accessControlSearch(getState())
    const permission = selectors.user.accessControlLevel(getState())
    try {
      await api.loaderSideEffect({
        dispatch,
        loader: () => loaders.createRole(cluster, id, {
          username,
          permission,
        }),
        prefix,
        name: 'addRole',
        returnError: true,
      })
      dispatch(snackbarActions.setSuccess(`role added`))
      dispatch(actions.listRoles(cluster, id))
      dispatch(userActions.closeAccessControlForm())
    } catch(e) {
      dispatch(snackbarActions.setError(`error adding role: ${e.toString()}`))
    }
  },
  deleteRole: (userid) =>  async (dispatch, getState) => {
    const params = selectors.router.params(getState())  
    const {
      cluster,
      id,
    } = params
    try {
      await api.loaderSideEffect({
        dispatch,
        loader: () => loaders.deleteRole(cluster, id, userid),
        prefix,
        name: 'deleteRole',
        returnError: true,
      })
      dispatch(snackbarActions.setSuccess(`role deleted`))
      dispatch(actions.listRoles(cluster, id))
    } catch(e) {
      dispatch(snackbarActions.setError(`error deleting role: ${e.toString()}`))
    }
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