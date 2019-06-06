import axios from 'axios'
import { normalize, schema } from 'normalizr'
import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'
import api from '../utils/api'

import snackbarActions from './snackbar'

const prefix = 'deploymentSettings'

const key = new schema.Entity('key')
const participant = new schema.Entity('participant')

const initialState = {
  localValidatorKeys: normalize([], [key]),
  localDamlRPCKeys: normalize([], [key]),
  remoteKeys: normalize([], [key]),
  damlParticipants: normalize([], [participant]),
  selectedParties: {},
}

const reducers = {
  setLocalValidatorKeys: (state, action) => {
    state.localValidatorKeys = normalize(action.payload, [key])
  },
  setLocalDamlRPCKeys: (state, action) => {
    state.localDamlRPCKeys = normalize(action.payload, [key])
  },
  setDamlParticipants: (state, action) => {
    state.damlParticipants = normalize(action.payload, [participant])
  },
  setRemoteKeys: (state, action) => {
    state.remoteKeys = normalize(action.payload, [key])
  },
  setSelectedParty: (state, action) => {
    const {
      participant,
      party,
      value,
    } = action.payload
    const parties = state.selectedParties[participant] || {}
    parties[party] = value
    state.selectedParties[participant] = parties
  },
  resetSelectedParties: (state, action) => {
    state.selectedParties = {}
  },
}

const loaders = {

  listLocalValidatorKeys: (cluster, id) => axios.get(api.url(`/clusters/${cluster}/deployments/${id}/localValidatorKeys`))
    .then(api.process),

  listLocalDamlRPCKeys: (cluster, id) => axios.get(api.url(`/clusters/${cluster}/deployments/${id}/localDamlRPCKeys`))
    .then(api.process),

  listRemoteKeys: (cluster, id) => axios.get(api.url(`/clusters/${cluster}/deployments/${id}/remoteKeys`))
    .then(api.process),

  listDamlParticipants: (cluster, id) => axios.get(api.url(`/clusters/${cluster}/deployments/${id}/damlParticipants`))
    .then(api.process),

  createRemoteKey: (cluster, id, key) => axios.post(api.url(`/clusters/${cluster}/deployments/${id}/remoteKeys`), {
    key,
  })
    .then(api.process),

  registerParticipant: (cluster, id, payload) => axios.post(api.url(`/clusters/${cluster}/deployments/${id}/registerParticipant`), payload)
    .then(api.process),

  rotateLocalDamlRPCKey: (cluster, id, payload) => axios.post(api.url(`/clusters/${cluster}/deployments/${id}/rotateLocalDamlRPCKey`), payload)
    .then(api.process),

}

const sideEffects = {

  listLocalValidatorKeys: ({
    cluster,
    id,
  }) => (dispatch, getState) => api.loaderSideEffect({
    dispatch,
    loader: () => loaders.listLocalValidatorKeys(cluster, id),
    prefix,
    name: 'listLocalValidatorKeys',
    dataAction: actions.setLocalValidatorKeys,
    snackbarError: true,
  }),

  listLocalDamlRPCKeys: ({
    cluster,
    id,
  }) => (dispatch, getState) => api.loaderSideEffect({
    dispatch,
    loader: () => loaders.listLocalDamlRPCKeys(cluster, id),
    prefix,
    name: 'listLocalDamlRPCKeys',
    dataAction: actions.setLocalDamlRPCKeys,
    snackbarError: true,
  }),

  listRemoteKeys: ({
    cluster,
    id,
  }) => (dispatch, getState) => api.loaderSideEffect({
    dispatch,
    loader: () => loaders.listRemoteKeys(cluster, id),
    prefix,
    name: 'listRemoteKeys',
    dataAction: actions.setRemoteKeys,
    snackbarError: true,
  }),

  listDamlParticipants: ({
    cluster,
    id,
  }) => (dispatch, getState) => api.loaderSideEffect({
    dispatch,
    loader: () => loaders.listDamlParticipants(cluster, id),
    prefix,
    name: 'listDamlParticipants',
    dataAction: actions.setDamlParticipants,
    snackbarError: true,
  }),

  loadDamlData: ({
    cluster,
    id,
  }) => async (dispatch, getState) => {
    await dispatch(actions.listLocalValidatorKeys({
      cluster,
      id,
    }))
    await dispatch(actions.listLocalDamlRPCKeys({
      cluster,
      id,
    }))
    await dispatch(actions.listRemoteKeys({
      cluster,
      id,
    }))
    await dispatch(actions.listDamlParticipants({
      cluster,
      id,
    }))    
  },

  createRemoteKey: ({
    cluster,
    id,
    key
  }) => async (dispatch, getState) => {

    if(!key) {
      dispatch(snackbarActions.setError(`please provide a remote key`))
      return
    }

    try {
      await api.loaderSideEffect({
        dispatch,
        loader: () => loaders.createRemoteKey(cluster, id, key),
        prefix,
        name: 'createRemoteKey',
        returnError: true,
      })
      dispatch(snackbarActions.setSuccess(`remote key created`))
      dispatch(actions.listRemoteKeys({
        cluster,
        id,
      }))
    } catch(e) {
      dispatch(snackbarActions.setError(`error creating remote key: ${e.toString()}`))
      console.error(e)
    }
  },

  registerParticipant: ({
    cluster,
    id,
    key,
  }) => async (dispatch, getState) => {

    try {
      await api.loaderSideEffect({
        dispatch,
        loader: () => loaders.registerParticipant(cluster, id, {key}),
        prefix,
        name: 'registerParticipant',
        returnError: true,
      })
      await dispatch(actions.loadDamlData({
        cluster,
        id,
      }))
      dispatch(snackbarActions.setSuccess(`participant registered`))
    } catch(e) {
      dispatch(snackbarActions.setError(`error registering participant: ${e.toString()}`))
      console.error(e)
    }
  },

  rotateLocalDamlRPCKey: ({
    cluster,
    id,
    key,
    damlId,
  }) => async (dispatch, getState) => {
    try {
      await api.loaderSideEffect({
        dispatch,
        loader: () => loaders.rotateLocalDamlRPCKey(cluster, id, {key,damlId}),
        prefix,
        name: 'rotateLocalDamlRPCKey',
        returnError: true,
      })
      await dispatch(actions.loadDamlData({
        cluster,
        id,
      }))
      dispatch(snackbarActions.setSuccess(`daml rpc key rotated`))
    } catch(e) {
      dispatch(snackbarActions.setError(`error rotating daml rpc key: ${e.toString()}`))
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