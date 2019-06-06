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