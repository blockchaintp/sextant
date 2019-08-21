import axios from 'axios'
import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'
import api from '../utils/api'

import snackbarActions from './snackbar'
import fileUploadActions from './fileupload'

const prefix = 'deploymentSettings'

const initialState = {
  keyManagerKeys: [],
  enrolledKeys: [],
  participants: [],
  archives: [],
  timeServiceInfo: [],

  visibleParticipant: null,
  selectedParties: {},

  addPartyWindowOpen: false,
  addPartyName: '',
  addPartyPublicKey: null,

  tokenWindowOpen: false,
  tokenValue: null,

  uploadArchiveWindowOpen: false,

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
  setParticipants: (state, action) => {
    state.participants = action.payload
  },
  setArchives: (state, action) => {
    state.archives = action.payload
  },
  setTimeServiceInfo: (state, action) => {
    state.timeServiceInfo = action.payload
  },
  setSelectedParty: (state, action) => {
    const {
      party,
      value,
    } = action.payload
    state.selectedParties[party] = value
  },
  setSelectedParties: (state, action) => {
    state.selectedParties = action.payload
  },
  resetSelectedParties: (state, action) => {
    state.selectedParties = {}
  },
  setVisibleParticipant: (state, action) => {
    state.visibleParticipant = action.payload
  },
  setUploadArchiveWindowOpen: (state, action) => {
    state.uploadArchiveWindowOpen = action.payload
  },
  setAddPartyWindowOpen: (state, action) => {
    state.addPartyWindowOpen = action.payload
  },
  setAddPartyName: (state, action) => {
    state.addPartyName = action.payload
  },
  setAddPartyPubicKey: (state, action) => {
    state.addPartyPublicKey = action.payload
  },
  setTokenWindowOpen: (state, action) => {
    state.tokenWindowOpen = action.payload
  },
  setToken: (state, action) => {
    state.tokenValue = action.payload
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

  listParticipants: ({
    cluster,
    id,
  }) => axios.get(api.url(`/clusters/${cluster}/deployments/${id}/participants`))
    .then(api.process),

  listArchives: ({
    cluster,
    id,
  }) => axios.get(api.url(`/clusters/${cluster}/deployments/${id}/archives`))
    .then(api.process),

  listTimeServiceInfo: ({
    cluster,
    id,
  }) => axios.get(api.url(`/clusters/${cluster}/deployments/${id}/timeServiceInfo`))
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

  addParty: ({
    cluster,
    id,
    publicKey,
    partyName,
  }) => axios.post(api.url(`/clusters/${cluster}/deployments/${id}/addParty`), {publicKey, partyName})
    .then(api.process),

  removeParties: ({
    cluster,
    id,
    publicKey,
    partyNames,
  }) => axios.post(api.url(`/clusters/${cluster}/deployments/${id}/removeParties`), {publicKey, partyNames})
    .then(api.process),

  generatePartyToken: ({
    cluster,
    id,
    publicKey,
    partyNames,
  }) => axios.post(api.url(`/clusters/${cluster}/deployments/${id}/generatePartyToken`), {publicKey, partyNames})
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
      dispatch(actions.listParticipants({
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
    } catch(e) {
      dispatch(snackbarActions.setError(`error enrolling key: ${e.toString()}`))
      console.error(e)
    }
  },

  listParticipants: ({
    cluster,
    id,
  }) => (dispatch, getState) => api.loaderSideEffect({
    dispatch,
    loader: () => loaders.listParticipants({cluster, id}),
    prefix,
    name: 'listParticipants',
    dataAction: actions.setParticipants,
    snackbarError: true,
  }),

  listArchives: ({
    cluster,
    id,
  }) => (dispatch, getState) => api.loaderSideEffect({
    dispatch,
    loader: () => loaders.listArchives({cluster, id}),
    prefix,
    name: 'listArchives',
    dataAction: actions.setArchives,
    snackbarError: true,
  }),

  listTimeServiceInfo: ({
    cluster,
    id,
  }) => (dispatch, getState) => api.loaderSideEffect({
    dispatch,
    loader: () => loaders.listTimeServiceInfo({cluster, id}),
    prefix,
    name: 'listTimeServiceInfo',
    dataAction: actions.setTimeServiceInfo,
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

  addParty: ({
    cluster,
    id,
    publicKey,
    partyName,
  }) => async (dispatch, getState) => {

    if(!partyName) {
      dispatch(snackbarActions.setError(`please enter a party name`))
      return
    }

    try {
      await api.loaderSideEffect({
        dispatch,
        loader: () => loaders.addParty({cluster, id, publicKey, partyName}),
        prefix,
        name: 'addParty',
        returnError: true,
      })
      dispatch(actions.loadParties({
        cluster,
        id,
      }))
      dispatch(snackbarActions.setSuccess(`party added`))
      dispatch(actions.setAddPartyWindowOpen(false))
      dispatch(actions.setAddPartyName(''))
      dispatch(actions.setAddPartyPubicKey(null))
    } catch(e) {
      dispatch(snackbarActions.setError(`error adding party: ${e.toString()}`))
      console.error(e)
    }
  },

  removeParties: ({
    cluster,
    id,
    publicKey,
    partyNames,
  }) => async (dispatch, getState) => {

    if(partyNames.length <= 0) {
      dispatch(snackbarActions.setError(`please select some parties to remove`))
      return
    }

    try {
      await api.loaderSideEffect({
        dispatch,
        loader: () => loaders.removeParties({cluster, id, publicKey, partyNames}),
        prefix,
        name: 'removeParties',
        returnError: true,
      })
      dispatch(actions.loadParties({
        cluster,
        id,
      }))
      dispatch(snackbarActions.setSuccess(`parties removed`))
    } catch(e) {
      dispatch(snackbarActions.setError(`error removing parties: ${e.toString()}`))
      console.error(e)
    }
  },

  generatePartyToken: ({
    cluster,
    id,
    publicKey,
    partyNames,
  }) => async (dispatch, getState) => {

    if(partyNames.length <= 0) {
      dispatch(snackbarActions.setError(`please select some parties to generate a token for`))
      return
    }

    try {
      const res = await api.loaderSideEffect({
        dispatch,
        loader: () => loaders.generatePartyToken({cluster, id, publicKey, partyNames}),
        prefix,
        name: 'generatePartyToken',
        returnError: true,
      })
      dispatch(actions.setToken(res.token))
      dispatch(actions.setTokenWindowOpen(true))
      dispatch(snackbarActions.setSuccess(`token generated`))
    } catch(e) {
      dispatch(snackbarActions.setError(`error removing parties: ${e.toString()}`))
      console.error(e)
    }
  },

  uploadArchive: ({
    cluster,
    id,
    files,
  }) => async (dispatch, getState) => {
    dispatch(fileUploadActions.startUploads({
      files,
      method: 'POST',
      url: api.url(`/clusters/${cluster}/deployments/${id}/uploadArchive`),
      onComplete: (results) => {
        dispatch(actions.setUploadArchiveWindowOpen(false))
        dispatch(snackbarActions.setSuccess(`archive uploaded`))
        dispatch(actions.listArchives({
          cluster,
          id,
        }))
      },
    }))
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
