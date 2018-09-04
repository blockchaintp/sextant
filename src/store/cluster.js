import { createSagas } from 'redux-box'
import { call, put, select } from 'redux-saga/effects'

import sagaErrorWrapper from '../utils/sagaErrorWrapper'
import clusterApi from '../api/cluster'
import snackbar from './snackbar'

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
    yield put(actions.setSubmitting(true))
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