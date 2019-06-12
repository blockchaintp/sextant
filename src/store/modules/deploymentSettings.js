import axios from 'axios'
import { normalize, schema } from 'normalizr'
import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'
import api from '../utils/api'

import snackbarActions from './snackbar'

const prefix = 'deploymentSettings'

const initialState = {
  keyManagerKeys: [],
  enrolledKeys: [],
  damlParticipants: [],
  archives: [{
    packageid: '3ab37fe8d_some.daml.package',
    size: '3123987',
    uploadedBy: 'participantA_Alice',
    uploaded: new Date().getTime() - (1000 * 60 * 60 * 24 * 5),
  }],
  timeService: [{
    publicKey: 'b23c0d330e89c3aa0700e0839f40033c',
    lastClockUpdate: '3127383',
  }],
  selectedParties: {},
  tokenDialogOpen: false,
  tokenValue: null,

  addEnrolledKeyDialogOpen: false,
  addEnrolledKeyValue: '',

  // are we looping for the following endpoints?
  loops: {
    keys: null,
  }
}

const reducers = {
  setKeyManagerKeys: (state, action) => {
    state.keyManagerKeys = action.payload
  },
  setEnrolledKeys: (state, action) => {
    state.enrolledKeys = action.payload
  },
  setDamlParticipants: (state, action) => {
    state.damlParticipants = action.payload
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
  setTokenDialogOpen: (state, action) => {
    state.tokenDialogOpen = action.payload.value
  },
  setToken: (state, action) => {
    state.tokenValue = action.payload.value
  },
  setAddEnrolledKeyDialogOpen: (state, action) => {
    state.addEnrolledKeyDialogOpen = action.payload
  },
  setAddEnrolledKeyValue: (state, action) => {
    state.addEnrolledKeyValue = action.payload
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

  listKeyManagerKeys: ({
    cluster,
    id,
  }) => axios.get(api.url(`/clusters/${cluster}/deployments/${id}/keyManagerKeys`))
    .then(api.process),

  listEnrolledKeys: ({
    cluster,
    id,
  }) => axios.get(api.url(`/clusters/${cluster}/deployments/${id}/enrolledKeys`))
    .then(api.process),

  addEnrolledKey: ({
    cluster,
    id,
    publicKey,
  }) => axios.post(api.url(`/clusters/${cluster}/deployments/${id}/enrolledKeys`), {
    publicKey,
  })
    .then(api.process),

  listDamlParticipants: ({
    cluster,
    id,
  }) => axios.get(api.url(`/clusters/${cluster}/deployments/${id}/damlParticipants`))
    .then(api.process),

  registerParticipant: ({
    cluster,
    id,
    publicKey,
  }) => axios.post(api.url(`/clusters/${cluster}/deployments/${id}/registerParticipant`), {publicKey})
    .then(api.process),

  rotateParticipantKey: ({
    cluster,
    id,
    publicKey,
  }) => axios.post(api.url(`/clusters/${cluster}/deployments/${id}/rotateKeys`), {publicKey})
    .then(api.process),

}

const sideEffects = {

  listKeyManagerKeys: ({
    cluster,
    id,
  }) => (dispatch, getState) => api.loaderSideEffect({
    dispatch,
    loader: () => loaders.listKeyManagerKeys({cluster, id}),
    prefix,
    name: 'listKeyManagerKeys',
    dataAction: actions.setKeyManagerKeys,
    snackbarError: true,
  }),

  listEnrolledKeys: ({
    cluster,
    id,
  }) => (dispatch, getState) => api.loaderSideEffect({
    dispatch,
    loader: () => loaders.listEnrolledKeys({cluster, id}),
    prefix,
    name: 'listEnrolledKeys',
    dataAction: actions.setEnrolledKeys,
    snackbarError: true,
  }),

  loadKeys: ({
    cluster,
    id,
  }) => async (dispatch, getState) => {
    await Promise.all([
      dispatch(actions.listKeyManagerKeys({
        cluster,
        id,
      })),
      dispatch(actions.listEnrolledKeys({
        cluster,
        id,
      }))
    ])
  },

  loadParties: ({
    cluster,
    id,
  }) => async (dispatch, getState) => {
    await Promise.all([
      dispatch(actions.listKeyManagerKeys({
        cluster,
        id,
      })),
      dispatch(actions.listDamlParticipants({
        cluster,
        id,
      }))
    ])
  },

  addEnrolledKey: ({
    cluster,
    id,
    publicKey,
  }) => async (dispatch, getState) => {

    if(!publicKey) {
      dispatch(snackbarActions.setError(`please provide a public key`))
      return
    }

    try {
      await api.loaderSideEffect({
        dispatch,
        loader: () => loaders.addEnrolledKey({cluster, id, publicKey}),
        prefix,
        name: 'addEnrolledKey',
        returnError: true,
      })
      dispatch(snackbarActions.setSuccess(`request succeeded`))
      dispatch(actions.setAddEnrolledKeyDialogOpen(false))
      dispatch(actions.setAddEnrolledKeyValue(''))
      dispatch(actions.listEnrolledKeys({
        cluster,
        id,
      }))
    } catch(e) {
      dispatch(snackbarActions.setError(`error enrolling key: ${e.toString()}`))
      console.error(e)
    }
  },

  listDamlParticipants: ({
    cluster,
    id,
  }) => (dispatch, getState) => api.loaderSideEffect({
    dispatch,
    loader: () => loaders.listDamlParticipants({cluster, id}),
    prefix,
    name: 'listDamlParticipants',
    dataAction: actions.setDamlParticipants,
    snackbarError: true,
  }),

  registerParticipant: ({
    cluster,
    id,
    publicKey,
  }) => async (dispatch, getState) => {

    try {
      await api.loaderSideEffect({
        dispatch,
        loader: () => loaders.registerParticipant({cluster, id, publicKey}),
        prefix,
        name: 'registerParticipant',
        returnError: true,
      })
      dispatch(actions.loadParties({
        cluster,
        id,
      }))
      dispatch(snackbarActions.setSuccess(`participant registered`))
    } catch(e) {
      dispatch(snackbarActions.setError(`error registering participant: ${e.toString()}`))
      console.error(e)
    }
  },

  rotateParticipantKey: ({
    cluster,
    id,
    publicKey,
  }) => async (dispatch, getState) => {
    try {
      await api.loaderSideEffect({
        dispatch,
        loader: () => loaders.rotateParticipantKey({cluster, id, publicKey}),
        prefix,
        name: 'rotateParticipantKey',
        returnError: true,
      })
      dispatch(actions.loadParties({
        cluster,
        id,
      }))
      dispatch(snackbarActions.setSuccess(`daml rpc key rotated`))
    } catch(e) {
      dispatch(snackbarActions.setError(`error rotating participant key: ${e.toString()}`))
      console.error(e)
    }
  },

  startKeysLoop: ({
    cluster,
    id,
  }) => async (dispatch, getState) => {
    dispatch(actions.setLoop({
      name: 'keys',
      value: true,
    }))
    dispatch(actions.keysLoop({
      cluster,
      id,
    }))    
  },
  keysLoop: ({
    cluster,
    id,
  }) => async (dispatch, getState) => {
    const looping = getState().deploymentSettings.loops.keys
    if(!looping) return
    await dispatch(actions.loadKeys({
      cluster,
      id,
    }))
    await new Promise(resolve => setTimeout(resolve, 1000))
    dispatch(actions.keysLoop({
      cluster,
      id,
    }))
  },
  stopKeysLoop: () => (dispatch, getState) => {
    dispatch(actions.setLoop({
      name: 'keys',
      value: false,
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