import axios from 'axios'
import { normalize, schema } from 'normalizr'
import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'
import api from '../utils/api'

import snackbarActions from './snackbar'

const prefix = 'deploymentSettings'

const key = new schema.Entity('key')

const initialState = {
  localKeys: normalize([], [key]),
  remoteKeys: normalize([], [key]),
}

const reducers = {
  setLocalKeys: (state, action) => {
    state.localKeys = normalize(action.payload, [key])
  },
  setRemoteKeys: (state, action) => {
    state.remoteKeys = normalize(action.payload, [key])
  },
}

const loaders = {

  listLocalKeys: (cluster, id) => axios.get(api.url(`/clusters/${cluster}/deployments/${id}/localKeys`))
    .then(api.process),

  listRemoteKeys: (cluster, id) => axios.get(api.url(`/clusters/${cluster}/deployments/${id}/remoteKeys`))
    .then(api.process),

  createRemoteKey: (cluster, id, key) => axios.post(api.url(`/clusters/${cluster}/deployments/${id}/remoteKeys`), {
    key,
  })
    .then(api.process),

}

const sideEffects = {

  listLocalKeys: ({
    cluster,
    id,
  }) => (dispatch, getState) => api.loaderSideEffect({
    dispatch,
    loader: () => loaders.listLocalKeys(cluster, id),
    prefix,
    name: 'listLocalKeys',
    dataAction: actions.setLocalKeys,
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