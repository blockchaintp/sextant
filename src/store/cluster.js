import { createSagas } from 'redux-box'
import { call, put, select, fork, take, cancel } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { touch, change, initialize, getFormValues } from 'redux-form'

import apiUtils from '../utils/api'
import sagaErrorWrapper from '../utils/sagaErrorWrapper'
import customTpUtils from '../utils/customTp'
import clusterApi from '../api/cluster'
import settings from '../settings'
import snackbar from './snackbar'
import selectors from './selectors'

const state = {
  list: [],
  // the single error message back from the server upon form submit
  asyncFormError: null,
  // used to show all sync errors at the bottom of a form once they click submit
  showSyncFormErrors: false,
  // are we in the process of submitting a form? used to disable form elements
  submitting: false,

  // create keypair values
  keypairWindowOpen: false,
  keypairPrivateKey: null,

  // the data for the current cluster being viewed
  currentClusterData: null,

  // the current info for the cluster
  clusterInfo: null,
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
  submitDeployForm: () => ({
    type: 'CLUSTER_SUBMIT_DEPLOY_FORM',
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
  resetDeploymentForm: () => ({
    type: 'CLUSTER_RESET_DEPLOYMENT_FORM',
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
  clusterInfoLoop: () => ({
    type: 'CLUSTER_INFO_LOOP',
  }),
  stopClusterInfoLoop: () => ({
    type: 'CLUSTER_STOP_INFO_LOOP',
  }),
  setClusterInfo: (data) => ({
    type: 'CLUSTER_SET_INFO',
    data,
  }),
  deleteCluster: (id) => ({
    type: 'CLUSTER_DELETE',
    id,
  }),
  undeployCluster: () => ({
    type: 'CLUSTER_UNDEPLOY',
  }),
  cleanupCluster: (id) => ({
    type: 'CLUSTER_CLEANUP',
    id,
  }),
  downloadKubeConfig: () => ({
    type: 'CLUSTER_DOWNLOAD_KUBE_CONFIG',
  }),
  downloadKopsConfig: () => ({
    type: 'CLUSTER_DOWNLOAD_KOPS_CONFIG',
  }),
  openDashboard: () => ({
    type: 'CLUSTER_OPEN_DASHBOARD',
  }),
  openMonitoring: () => ({
    type: 'CLUSTER_OPEN_MONITORING',
  }),
  openXoDemo: () => ({
    type: 'CLUSTER_OPEN_XO_DEMO',
  }),
  externalSeedAdd: () => ({
    type: 'CLUSTER_EXTERNAL_SEED_ADD',
  }),
  externalSeedDelete: (seedAddress) => ({
    type: 'CLUSTER_EXTERNAL_SEED_DELETE',
    seedAddress,
  }),
  customTpAdd: () => ({
    type: 'CLUSTER_CUSTOM_TP_ADD',
  }),
  customTpDelete: (name) => ({
    type: 'CLUSTER_CUSTOM_TP_DELETE',
    name,
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
  CLUSTER_SET_INFO: (state, action) => {
    state.clusterInfo = action.data
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


// keep looping to get the cluster info
function* clusterInfoLoop(clusterId) {
  try {
    while (true) {
      try{
        const response = yield call(clusterApi.info, clusterId)
        yield put(actions.setClusterInfo(response.data))
      }
      catch(err){
        yield put(snackbar.actions.setError(err))
        yield put(actions.stopClusterInfoLoop())
      }
      yield call(delay, settings.loopDelays.clusterInfo)
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

  CLUSTER_RESET_DEPLOYMENT_FORM: function* () {
    yield put(actions.setAsyncFormError(null))
    yield put(actions.setShowSyncFormErrors(false))
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
      yield put(snackbar.actions.setMessage(`cluster ${formValues.name} is creating`))
    }
    catch(err){
      yield put(snackbar.actions.setError(err))
      yield put(actions.setAsyncFormError(apiUtils.getError(err)))
    }

    yield put(actions.setSubmitting(false))
  },

  CLUSTER_SUBMIT_DEPLOY_FORM: function* () {
    const payload = yield select(selectors.router.payload)
    const clusterId = payload.name
    const formFields = yield select(state => selectors.form.fieldNames(state, 'deploymentForm'))
    const formValues = yield select(state => selectors.form.values(state, 'deploymentForm'))
    const hasError = yield select(state => selectors.form.hasError(state, 'deploymentForm'))

    if(hasError) {
      yield put(actions.setShowSyncFormErrors(true))
      yield put(touch.apply(null, ['deploymentForm'].concat(formFields)))
      return  
    }

    const formPayload = Object.assign({}, formValues)
    delete(formPayload.new_seed)
    delete(formPayload.custom_tp_name)
    delete(formPayload.custom_tp_image)
    delete(formPayload.custom_tp_command)
    delete(formPayload.custom_tp_args)

    yield put(actions.setShowSyncFormErrors(false))
    yield put(actions.setAsyncFormError(null))
    yield put(actions.setSubmitting(true))

    try{
      const response = yield call(clusterApi.deploy, clusterId, formPayload)
      yield put(snackbar.actions.setMessage(`cluster ${clusterId} is deploying`))
      yield put(actions.loadClusterData())
    }
    catch(err){
      yield put(snackbar.actions.setError(err))
      yield put(actions.setAsyncFormError(apiUtils.getError(err)))
    }

    yield put(actions.setSubmitting(false))
  },

  CLUSTER_UNDEPLOY: function* (action) {

    const payload = yield select(selectors.router.payload)
    const clusterId = payload.name

    // load the cluster list so we have the cluster data in the case the delete
    // button is clicked from the view page
    yield put(actions.loadList())
    yield take('CLUSTER_SET_LIST')
    const clusters = yield select(state => state.cluster.list)
    const cluster = clusters.filter(c => c.settings.name == clusterId)[0]

    let canUndeploy = false

    if(cluster.status.phase == "deployed") {
      canUndeploy = true
    }
    // you can undeploy if the state is error and the errorPhase is deploy
    // this means the k8s manifests had some kind of problem so let's undeploy them
    else if(cluster.status.phase == "error" && cluster.status.errorPhase == "deploy") {
      canUndeploy = true
    }

    if(!canUndeploy) {
      yield put(snackbar.actions.setError(`The ${clusterId} cluster cannot be undeployed`))
      return
    }

    try{
      const response = yield call(clusterApi.undeploy, clusterId)
      yield put(snackbar.actions.setMessage(`cluster ${clusterId} is undeploying`))
      yield put(actions.loadClusterData())
    }
    catch(err){
      yield put(snackbar.actions.setError(err))
    }
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
      else if(status.phase == 'created') {
        
      }
      else if(status.phase == 'deploying') {
        yield put(actions.clusterStatusLoop('deploying')) 
        yield put(actions.clusterInfoLoop())
      }
      else if(status.phase == 'undeploying') {
        yield put(actions.clusterStatusLoop('undeploying'))
        yield put(actions.clusterInfoLoop())
      }
      else if(status.phase == 'deployed') {
        yield put(actions.clusterInfoLoop())
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

  CLUSTER_INFO_LOOP: function* (action) {
    const payload = yield select(selectors.router.payload)
    const clusterId = payload.name
    const clusterInfoLoopTask = yield fork(clusterInfoLoop, clusterId)
    yield take(action => action.type == 'CLUSTER_STOP_INFO_LOOP')
    yield cancel(clusterInfoLoopTask)
  },

  CLUSTER_DELETE: function* (action) {
    const clusterId = action.id

    // load the cluster list so we have the cluster data in the case the delete
    // button is clicked from the view page
    yield put(actions.loadList())
    yield put(actions.stopClusterInfoLoop())
    yield take('CLUSTER_SET_LIST')
    const clusters = yield select(state => state.cluster.list)
    const cluster = clusters.filter(c => c.settings.name == clusterId)[0]

    if(cluster.status.phase == "deleted") {
      yield put(actions.cleanupCluster(clusterId))
      return
    }

    try{
      const response = yield call(clusterApi.delete, clusterId)
      yield put(actions.viewCluster(clusterId))
      yield put(actions.loadClusterData())
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

  CLUSTER_DOWNLOAD_KUBE_CONFIG: function* (action) {
    const payload = yield select(selectors.router.payload)
    const clusterId = payload.name
    const url = clusterApi.url(`/kubeconfig/${clusterId}`)
    window.open(url)
  },

  CLUSTER_DOWNLOAD_KOPS_CONFIG: function* (action) {
    const payload = yield select(selectors.router.payload)
    const clusterId = payload.name
    const url = clusterApi.url(`/kopsconfig/${clusterId}`)
    window.open(url)
  },

  CLUSTER_OPEN_DASHBOARD: function* (action) {
    const payload = yield select(selectors.router.payload)
    const clusterId = payload.name
    const url = `/proxy/${clusterId}/kube-system/kubernetes-dashboard/`
    window.open(url)
  },

  CLUSTER_OPEN_MONITORING: function* (action) {
    const clusterInfo = yield select(state => state.cluster.clusterInfo)
    if(!clusterInfo.grafana) return
    if(!clusterInfo.grafana.status.loadBalancer) return
    if(!clusterInfo.grafana.status.loadBalancer.ingress) return
    const url = clusterInfo.grafana.status.loadBalancer.ingress[0].hostname
    window.open(`http://${url}`)
  },

  CLUSTER_OPEN_XO_DEMO: function* (action) {
    const clusterInfo = yield select(state => state.cluster.clusterInfo)
    if(!clusterInfo.xodemo) return
    if(!clusterInfo.xodemo.status.loadBalancer) return
    if(!clusterInfo.xodemo.status.loadBalancer.ingress) return
    const url = clusterInfo.xodemo.status.loadBalancer.ingress[0].hostname
    window.open(`http://${url}`)
  },

  CLUSTER_EXTERNAL_SEED_ADD: function* (action) {
    const formValues = yield select(state => getFormValues('deploymentForm')(state))
    const currentSeeds = formValues.external_seeds
    const newSeed = formValues.new_seed
    const newSeeds = currentSeeds.filter(s => s != newSeed).concat(newSeed)
    yield put(change('deploymentForm', 'external_seeds', newSeeds))
    yield put(change('deploymentForm', 'new_seed', ''))
  },

  CLUSTER_EXTERNAL_SEED_DELETE: function* (action) {
    const formValues = yield select(state => getFormValues('deploymentForm')(state))
    const currentSeeds = formValues.external_seeds
    const deleteSeed = action.seedAddress
    const newSeeds = currentSeeds.filter(s => s != deleteSeed)
    yield put(change('deploymentForm', 'external_seeds', newSeeds))
  },

  CLUSTER_CUSTOM_TP_ADD: function* (action) {
    const formValues = yield select(state => getFormValues('deploymentForm')(state))
    const currentTps = formValues.custom_tps

    const newTp = {
      name: formValues.custom_tp_name,
      image: formValues.custom_tp_image,
      command: customTpUtils.splitCommand(formValues.custom_tp_command),
      args: customTpUtils.splitCommand(formValues.custom_tp_args),
    }
    
    const newTps = currentTps.filter(tp => tp.name != newTp.name).concat(newTp)
    yield put(change('deploymentForm', 'custom_tps', newTps))
    yield put(change('deploymentForm', 'custom_tp_name', ''))
    yield put(change('deploymentForm', 'custom_tp_image', ''))
    yield put(change('deploymentForm', 'custom_tp_command', ''))
    yield put(change('deploymentForm', 'custom_tp_args', ''))
  },

  CLUSTER_CUSTOM_TP_DELETE: function* (action) {
    const formValues = yield select(state => getFormValues('deploymentForm')(state))
    const currentTps = formValues.custom_tps
    const deleteTp = action.name
    const newTps = currentTps.filter(tp => tp.name != deleteTp)
    yield put(change('deploymentForm', 'custom_tps', newTps))
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