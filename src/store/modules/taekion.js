import axios from 'axios'
import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'
import api from '../utils/api'

import snackbarActions from './snackbar'

const prefix = 'taekion'

const initialState = {
  keys: [],
  volumes: [],
  snapshots: [],
  addKeyWindowOpen: false,
  addKeyResult: null,
  addVolumeWindowOpen: false,
  addSnapshotWindowOpen: false,
}

const reducers = {
  setKeys: (state, action) => {
    state.keys = action.payload
  },
  setVolumes: (state, action) => {
    state.volumes = action.payload
  },
  setSnapshots: (state, action) => {
    state.snapshots = action.payload
  },
  setAddKeyWindowOpen: (state, action) => {
    state.addKeyWindowOpen = action.payload
  },
  setAddKeyResult: (state, action) => {
    state.addKeyResult = action.payload
  },
  setAddVolumeWindowOpen: (state, action) => {
    state.addVolumeWindowOpen = action.payload
  },
  setAddSnapshotWindowOpen: (state, action) => {
    state.addSnapshotWindowOpen = action.payload
  },
}

const loaders = {

  listKeys: ({
    cluster,
    deployment,
  }) => axios.get(api.url(`/clusters/${cluster}/deployments/${deployment}/taekion/keys`))
    .then(api.process),

  createKey: ({
    cluster,
    deployment,
    payload,
  }) => axios.post(api.url(`/clusters/${cluster}/deployments/${deployment}/taekion/keys`), payload)
    .then(api.process),

  deleteKey: ({
    cluster,
    deployment,
    id,
  }) => axios.delete(api.url(`/clusters/${cluster}/deployments/${deployment}/taekion/keys/${id}`))
    .then(api.process),

  listVolumes: ({
    cluster,
    deployment,
  }) => axios.get(api.url(`/clusters/${cluster}/deployments/${deployment}/taekion/volumes`))
    .then(api.process),

  createVolume: ({
    cluster,
    deployment,
    payload,
  }) => axios.post(api.url(`/clusters/${cluster}/deployments/${deployment}/taekion/volumes`), payload)
    .then(api.process),

  deleteVolume: ({
    cluster,
    deployment,
    name,
  }) => axios.delete(api.url(`/clusters/${cluster}/deployments/${deployment}/taekion/volumes/${name}`))
    .then(api.process),

  listSnapshots: ({
    cluster,
    deployment,
    volumeName,
  }) => axios.get(api.url(`/clusters/${cluster}/deployments/${deployment}/taekion/volumes/${volumeName}/snapshots`))
    .then(api.process),

  createSnapshot: ({
    cluster,
    deployment,
    volumeName,
    payload,
  }) => axios.post(api.url(`/clusters/${cluster}/deployments/${deployment}/taekion/volumes/${volumeName}/snapshots`), payload)
    .then(api.process),


}

const sideEffects = {

  listKeys: ({
    cluster,
    deployment,
  }) => (dispatch, getState) => api.loaderSideEffect({
    dispatch,
    loader: () => loaders.listKeys({cluster, deployment}),
    prefix,
    name: 'listKeys',
    dataAction: actions.setKeys,
    snackbarError: true,
  }),

  createKey: ({
    cluster,
    deployment,
    payload,
  }) => async (dispatch, getState) => {

    try {
      const data = await api.loaderSideEffect({
        dispatch,
        loader: () => loaders.createKey({cluster, deployment, payload}),
        prefix,
        name: 'createKey',
        returnError: true,
      })
      dispatch(actions.listKeys({
        cluster,
        deployment,
      }))
      dispatch(snackbarActions.setSuccess(`key added`))
      dispatch(actions.setAddKeyResult(data))
      dispatch(actions.setAddKeyWindowOpen(false))
    } catch(e) {
      dispatch(snackbarActions.setError(`error adding key: ${e.toString()}`))
      console.error(e)
    }
  },

  deleteKey: ({
    cluster,
    deployment,
    id,
  }) => async (dispatch, getState) => {

    try {
      await api.loaderSideEffect({
        dispatch,
        loader: () => loaders.deleteKey({cluster, deployment, id}),
        prefix,
        name: 'deleteKey',
        returnError: true,
      })
      dispatch(actions.listKeys({
        cluster,
        deployment,
      }))
      dispatch(snackbarActions.setSuccess(`key deleted`))
    } catch(e) {
      dispatch(snackbarActions.setError(`error deleting key: ${e.toString()}`))
      console.error(e)
    }
  },

  listVolumes: ({
    cluster,
    deployment,
  }) => (dispatch, getState) => api.loaderSideEffect({
    dispatch,
    loader: () => loaders.listVolumes({cluster, deployment}),
    prefix,
    name: 'listVolumes',
    dataAction: actions.setVolumes,
    snackbarError: true,
  }),

  createVolume: ({
    cluster,
    deployment,
    payload,
  }) => async (dispatch, getState) => {

    try {
      await api.loaderSideEffect({
        dispatch,
        loader: () => loaders.createVolume({cluster, deployment, payload}),
        prefix,
        name: 'createVolume',
        returnError: true,
      })
      dispatch(actions.listVolumes({
        cluster,
        deployment,
      }))
      dispatch(snackbarActions.setSuccess(`volume added`))
      dispatch(actions.setAddVolumeWindowOpen(false))
    } catch(e) {
      dispatch(snackbarActions.setError(`error adding volume: ${e.toString()}`))
      console.error(e)
    }
  },

  deleteVolume: ({
    cluster,
    deployment,
    name,
  }) => async (dispatch, getState) => {

    try {
      await api.loaderSideEffect({
        dispatch,
        loader: () => loaders.deleteVolume({cluster, deployment, name}),
        prefix,
        name: 'deleteVolume',
        returnError: true,
      })
      dispatch(actions.listVolumes({
        cluster,
        deployment,
      }))
      dispatch(snackbarActions.setSuccess(`volume deleted`))
    } catch(e) {
      dispatch(snackbarActions.setError(`error deleting volume: ${e.toString()}`))
      console.error(e)
    }
  },

  listSnapshots: ({
    cluster,
    deployment,
    volumeName,
  }) => (dispatch, getState) => api.loaderSideEffect({
    dispatch,
    loader: () => loaders.listSnapshots({cluster, deployment, volumeName}),
    prefix,
    name: 'listSnapshots',
    dataAction: actions.setSnapshots,
    snackbarError: true,
  }),

  createSnapshot: ({
    cluster,
    deployment,
    volumeName,
    payload,
  }) => async (dispatch, getState) => {

    try {
      await api.loaderSideEffect({
        dispatch,
        loader: () => loaders.createSnapshot({cluster, deployment, volumeName, payload}),
        prefix,
        name: 'createSnapshot',
        returnError: true,
      })
      dispatch(actions.listSnapshots({
        cluster,
        deployment,
        volumeName,
      }))
      dispatch(snackbarActions.setSuccess(`snapshot added`))
    } catch(e) {
      dispatch(snackbarActions.setError(`error adding snapshot: ${e.toString()}`))
      console.error(e)
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
