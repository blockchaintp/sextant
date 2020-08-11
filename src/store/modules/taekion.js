import axios from 'axios'
import Promise from 'bluebird'
import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'
import api from '../utils/api'

import snackbarActions from './snackbar'
import networkActions from './network'

import selectors from '../selectors'

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

  updateVolume: ({
    cluster,
    deployment,
    volume,
    payload,
  }) => axios.put(api.url(`/clusters/${cluster}/deployments/${deployment}/taekion/volumes/${volume}`), payload)
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
    volume,
  }) => axios.get(api.url(`/clusters/${cluster}/deployments/${deployment}/taekion/volumes/${volume}/snapshots`))
    .then(api.process),

  createSnapshot: ({
    cluster,
    deployment,
    volume,
    payload,
  }) => axios.post(api.url(`/clusters/${cluster}/deployments/${deployment}/taekion/volumes/${volume}/snapshots`), payload)
    .then(api.process),

  deleteSnapshot: ({
    cluster,
    deployment,
    volume,
    snapshotName,
  }) => axios.delete(api.url(`/clusters/${cluster}/deployments/${deployment}/taekion/volumes/${volume}/snapshots/${snapshotName}`))
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
      dispatch(networkActions.setGlobalLoading(true))
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
      dispatch(networkActions.setGlobalLoading(false))
    } catch(e) {
      dispatch(snackbarActions.setError(`error adding key: ${e.toString()}`))
      console.error(e)
      dispatch(networkActions.setGlobalLoading(false))
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
      dispatch(networkActions.setGlobalLoading(true))
      await Promise.delay(10000)
      await api.loaderSideEffect({
        dispatch,
        loader: () => loaders.createVolume({cluster, deployment, payload}),
        prefix,
        name: 'createVolume',
        returnError: true,
      })
      await dispatch(actions.listVolumes({
        cluster,
        deployment,
      }))
      dispatch(snackbarActions.setSuccess(`volume added`))
      dispatch(actions.setAddVolumeWindowOpen(false))
      dispatch(networkActions.setGlobalLoading(false))
    } catch(e) {
      dispatch(snackbarActions.setError(`error adding volume: ${e.toString()}`))
      console.error(e)
      dispatch(networkActions.setGlobalLoading(false))
    }
  },

  updateVolume: ({
    cluster,
    deployment,
    volume,
    payload,
  }) => async (dispatch, getState) => {

    try {
      dispatch(networkActions.setGlobalLoading(true))
      await api.loaderSideEffect({
        dispatch,
        loader: () => loaders.updateVolume({ cluster, deployment, volume, payload }),
        prefix,
        name: 'updateVolume',
        returnError: true,
      })
      await dispatch(actions.listVolumes({
        cluster,
        deployment,
      }))
      dispatch(snackbarActions.setSuccess(`volume updated`))
      dispatch(actions.setAddVolumeWindowOpen(false))
      dispatch(networkActions.setGlobalLoading(false))
    } catch (e) {
      dispatch(snackbarActions.setError(`error updating volume: ${e.toString()}`))
      console.error(e)
      dispatch(networkActions.setGlobalLoading(false))
    }
  },

  deleteVolume: ({
    cluster,
    deployment,
    name,
  }) => async (dispatch, getState) => {

    try {
      dispatch(networkActions.setGlobalLoading(true))
      await api.loaderSideEffect({
        dispatch,
        loader: () => loaders.deleteVolume({cluster, deployment, name}),
        prefix,
        name: 'deleteVolume',
        returnError: true,
      })
      await dispatch(actions.listVolumes({
        cluster,
        deployment,
      }))
      dispatch(snackbarActions.setSuccess(`volume deleted`))
      dispatch(networkActions.setGlobalLoading(false))
    } catch(e) {
      dispatch(snackbarActions.setError(`error deleting volume: ${e.toString()}`))
      console.error(e)
      dispatch(networkActions.setGlobalLoading(false))
    }
  },

  listSnapshots: ({
    cluster,
    deployment,
    volume,
  }) => (dispatch, getState) => api.loaderSideEffect({
    dispatch,
    loader: () => loaders.listSnapshots({cluster, deployment, volume}),
    prefix,
    name: 'listSnapshots',
    dataAction: actions.setSnapshots,
    snackbarError: true,
  }),

  createSnapshot: ({
    cluster,
    deployment,
    volume,
    payload,
  }) => async (dispatch, getState) => {
    try {
      dispatch(networkActions.setGlobalLoading(true))
      await api.loaderSideEffect({
        dispatch,
        loader: () => loaders.createSnapshot({cluster, deployment, volume, payload}),
        prefix,
        name: 'createSnapshot',
        returnError: true,
      })
      await dispatch(actions.listSnapshots({
        cluster,
        deployment,
        volume,
      }))
      dispatch(snackbarActions.setSuccess(`snapshot added`))
      dispatch(actions.setAddSnapshotWindowOpen(false))
      dispatch(networkActions.setGlobalLoading(false))
    } catch(e) {
      dispatch(snackbarActions.setError(`error adding snapshot: ${e.toString()}`))
      console.error(e)
      dispatch(networkActions.setGlobalLoading(false))
    }
  },

  deleteSnapshot: ({
    cluster,
    deployment,
    volume,
    snapshotName,
  }) => async (dispatch, getState) => {

    const params = selectors.router.params(getState())

    try {
      dispatch(networkActions.setGlobalLoading(true))
      await api.loaderSideEffect({
        dispatch,
        loader: () => loaders.deleteSnapshot({cluster, deployment, volume, snapshotName}),
        prefix,
        name: 'deleteSnapshot',
        returnError: true,
      })
      await dispatch(actions.listSnapshots({
        cluster,
        deployment,
        volume: params.volume,
      }))
      dispatch(snackbarActions.setSuccess(`snapshot deleted`))
      dispatch(networkActions.setGlobalLoading(false))
    } catch(e) {
      dispatch(snackbarActions.setError(`error deleting snapshot: ${e.toString()}`))
      console.error(e)
      dispatch(networkActions.setGlobalLoading(false))
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
