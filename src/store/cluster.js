import { createSagas } from 'redux-box'
import { call, put, select, fork, take, cancel } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { touch, change, initialize } from 'redux-form'

import apiUtils from '../utils/api'
import sagaErrorWrapper from '../utils/sagaErrorWrapper'
import clusterApi from '../api/cluster'
import settings from '../settings'
import snackbar from './snackbar'
import selectors from './selectors'

const state = {
  list: [],
  // the single error message back from the server upon form submit
  asyncFormError: null,
  // used to show all sync errors at the bottom of the form once they click submit
  showSyncFormErrors: false,
  // are we in the process of submitting the form? used to disable form elements
  submitting: false,

  // create keypair values
  keypairWindowOpen: false,
  keypairPrivateKey: null,

  // the data for the current cluster being viewed
  currentClusterData: null,
}

const actions = {
  loadList: () => ({
    type: 'CLUSTER_LOAD_LIST',
  }),
  setList: (data) => ({
    type: 'CLUSTER_SET_LIST',
    data,
  }),
  viewList: () => ({
    type: 'PAGE_CLUSTER_LIST',
  }),
  add: () => ({
    type: 'PAGE_CLUSTER_ADD_NEW',
  }),
  viewList: () => ({
    type: 'PAGE_CLUSTER_LIST',
  }),
  submitAddForm: () => ({
    type: 'CLUSTER_SUBMIT_ADD_FORM',
  }),
  setSubmitting: (value) => ({
    type: 'CLUSTER_SET_SUBMITTING',
    value,
  }),
  setAsyncFormError: (value) => ({
    type: 'CLUSTER_SET_ASYNC_FORM_ERROR',
    value,
  }),
  setShowSyncFormErrors: (value) => ({
    type: 'CLUSTER_SET_SHOW_SYNC_FORM_ERRORS',
    value,
  }),
  regionChanged: () => ({
    type: 'CLUSTER_REGION_CHANGED',
  }),
  createKeypair: () => ({
    type: 'CLUSTER_CREATE_KEYPAIR',
  }),
  closeKeypairWindow: () => ({
    type: 'CLUSTER_CLOSE_KEYPAIR_WINDOW',
  }),
  openKeypairWindow: (privateKey) => ({
    type: 'CLUSTER_OPEN_KEYPAIR_WINDOW',
    privateKey,
  }),
  privateKeyCopied: () => snackbar.actions.setMessage('private key copied to clipboard'),
  resetForm: () => ({
    type: 'CLUSTER_RESET_FORM',
  }),
  viewCluster: (name) => ({
    type: 'PAGE_CLUSTER_VIEW',
    payload: {
      name,
    }
  }),
  loadClusterData: () => ({
    type: 'CLUSTER_LOAD_DATA',
  }),
  setClusterData: (data) => ({
    type: 'CLUSTER_SET_DATA',
    data,
  }),
  clusterStatusLoop: (loopWhileInPhase) => ({
    type: 'CLUSTER_STATUS_LOOP',
    loopWhileInPhase,
  }),
  stopClusterStatusLoop: () => ({
    type: 'CLUSTER_STOP_STATUS_LOOP',
  }),
  deleteCluster: (id) => ({
    type: 'CLUSTER_DELETE',
    id,
  }),
  cleanupCluster: (id) => ({
    type: 'CLUSTER_CLEANUP',
    id,
  })
}

const mutations = {
  CLUSTER_SET_LIST: (state, action) => {
    state.list = action.data
  },
  CLUSTER_SET_SUBMITTING: (state, action) => {
    state.submitting = action.value
  },
  CLUSTER_SET_ASYNC_FORM_ERROR: (state, action) => {
    state.asyncFormError = action.value
  },
  CLUSTER_SET_SHOW_SYNC_FORM_ERRORS: (state, action) => {
    state.showSyncFormErrors = action.value
  },
  CLUSTER_OPEN_KEYPAIR_WINDOW: (state, action) => {
    state.keypairWindowOpen = true
    state.keypairPrivateKey = action.privateKey
  },
  CLUSTER_CLOSE_KEYPAIR_WINDOW: (state, action) => {
    state.keypairWindowOpen = false
    state.keypairPrivateKey = null
  },
  CLUSTER_SET_DATA: (state, action) => {
    state.currentClusterData = action.data
  },
}

// keep looping while the cluster status.phase is in the given phase
// as soon as it's not in that phase - cancel the loop and re-load the
// cluster data to update the UI
function* clusterStatusLoop(clusterId, loopWhileInPhase) {
  try {
    while (true) {
      try{
        const response = yield call(clusterApi.status, clusterId)
        const { phase } = response.data
        if(phase != loopWhileInPhase) {
          yield put(actions.loadClusterData())
          yield put(actions.stopClusterStatusLoop())
        }
      }
      catch(err){
        yield put(snackbar.actions.setError(err))
        yield put(actions.stopClusterStatusLoop())
      }
      yield call(delay, settings.loopDelays.clusterCreating)
    }
  } finally {
    
  }
}

const SAGAS = sagaErrorWrapper({
  CLUSTER_LOAD_LIST: function* () {
    try{
      const response = yield call(clusterApi.list)
      yield put(actions.setList(response.data))
    }
    catch(err){
      yield put(snackbar.actions.setError(err))
    }
  },
  // when the region changes - clear the values for the {master,node}_zones
  // in the cluster form
  CLUSTER_REGION_CHANGED: function* () {
    yield put(change('clusterForm', 'master_zones', []))
    yield put(change('clusterForm', 'node_zones', []))
  },

  CLUSTER_RESET_FORM: function* () {
    yield put(actions.setAsyncFormError(null))
    yield put(actions.setShowSyncFormErrors(false))
    yield put(actions.closeKeypairWindow())
  },

  CLUSTER_CREATE_KEYPAIR: function* () {
    yield put(actions.setSubmitting(true))

    try{
      const response = yield call(clusterApi.createKeypair, {})
      const { privateKey, publicKey } = response.data
      yield put(change('clusterForm', 'public_key', publicKey))
      yield put(actions.openKeypairWindow(privateKey))
    }
    catch(err){
      yield put(snackbar.actions.setError(err))
    }

    yield put(actions.setSubmitting(false))
  },  

  CLUSTER_SUBMIT_ADD_FORM: function* () {
    const formFields = yield select(state => selectors.form.fieldNames(state, 'clusterForm'))
    const formValues = yield select(state => selectors.form.values(state, 'clusterForm'))
    const hasError = yield select(state => selectors.form.hasError(state, 'clusterForm'))

    if(hasError) {
      yield put(actions.setShowSyncFormErrors(true))
      yield put(touch.apply(null, ['clusterForm'].concat(formFields)))
      return  
    }

    yield put(actions.setShowSyncFormErrors(false))
    yield put(actions.setAsyncFormError(null))
    yield put(actions.setSubmitting(true))

    try{
      const response = yield call(clusterApi.create, formValues)

      yield put(actions.viewCluster(formValues.name))
    }
    catch(err){
      yield put(snackbar.actions.setError(err))
      yield put(actions.setAsyncFormError(apiUtils.getError(err)))
    }

    yield put(actions.setSubmitting(false))
  },

  CLUSTER_LOAD_DATA: function* () {
    const payload = yield select(selectors.router.payload)
    const clusterName = payload.name

    try{
      const response = yield call(clusterApi.get, clusterName)
      const { settings, status } = response.data

      yield put(actions.setClusterData(response.data))

      if(status.phase == 'creating') {
        yield put(actions.clusterStatusLoop('creating'))
      }
      else if(status.phase == 'deleting') {
        yield put(actions.clusterStatusLoop('deleting')) 
      }
    }
    catch(err){
      yield put(snackbar.actions.setError(err))
    }
  },

  CLUSTER_STATUS_LOOP: function* (action) {
    const payload = yield select(selectors.router.payload)
    const clusterId = payload.name
    const clusterStatusLoopTask = yield fork(clusterStatusLoop, clusterId, action.loopWhileInPhase)
    yield take(action => action.type == 'CLUSTER_STOP_STATUS_LOOP')
    yield cancel(clusterStatusLoopTask)
  },

  CLUSTER_DELETE: function* (action) {
    const clusterId = action.id
    const clusters = yield select(state => state.cluster.list)
    const cluster = clusters.filter(c => c.settings.name == clusterId)[0]

    if(cluster.status.phase == "deleted") {
      yield put(actions.cleanupCluster(clusterId))
      return
    }

    try{
      const response = yield call(clusterApi.delete, clusterId)
      yield put(actions.viewCluster(clusterId))
    }
    catch(err){
      yield put(snackbar.actions.setError(err))
    }
  },

  CLUSTER_CLEANUP: function* (action) {
    const clusterId = action.id

    try{
      const response = yield call(clusterApi.cleanup, clusterId)
      // call load list again in case we are already on the list page
      yield put(actions.loadList())
      yield put(actions.viewList())

      yield put(snackbar.actions.setMessage(`${clusterId} cluster has been removed`))
    }
    catch(err){
      yield put(snackbar.actions.setError(err))
    }
  },
  
})

const sagas = createSagas(SAGAS)

const module = {
  name : 'cluster',
  state, 
  actions, 
  mutations, 
  sagas,
}

export default module