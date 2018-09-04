import { createSagas } from 'redux-box'
import { call, put, select } from 'redux-saga/effects'
import { touch, change, initialize } from 'redux-form'

import sagaErrorWrapper from '../utils/sagaErrorWrapper'
import clusterApi from '../api/cluster'
import snackbar from './snackbar'
import selectors from './selectors'

const state = {
  list: [],
  submitting: false,
}

const actions = {
  loadList: () => ({
    type: 'CLUSTER_LOAD_LIST',
  }),
  setList: (data) => ({
    type: 'CLUSTER_SET_LIST',
    data,
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
  regionChanged: () => ({
    type: 'CLUSTER_REGION_CHANGED',
  })
}

const mutations = {
  CLUSTER_SET_LIST: (state, action) => {
    state.list = action.data
  },
  CLUSTER_SET_SUBMITTING: (state, action) => {
    state.submitting = action.value
  },
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
  CLUSTER_SUBMIT_ADD_FORM: function* () {
    const formFields = yield select(state => selectors.form.fieldNames(state, 'clusterForm'))
    const hasError = yield select(state => selectors.form.hasError(state, 'clusterForm'))

    if(hasError) {
      yield put(touch.apply(null, ['clusterForm'].concat(formFields)))
      return  
    }

    yield put(actions.setSubmitting(true))
  },
  // when the region changes - clear the values for the {master,node}_zones
  // in the cluster form
  CLUSTER_REGION_CHANGED: function* () {
    yield put(change('clusterForm', 'master_zones', []))
    yield put(change('clusterForm', 'node_zones', []))
  }
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