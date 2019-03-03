import { createSagas } from 'redux-box'
import { call, put, select } from 'redux-saga/effects'
import { touch, change, initialize, getFormValues } from 'redux-form'

import apiUtils from '../utils/api'
import sagaErrorWrapper from '../utils/sagaErrorWrapper'
import configApi from '../api/config'
import snackbar from './snackbar'
import selectors from './selectors'
import auth from './auth'

const state = {
  values: {},
  loaded: false,
  aws: {},
  awsLoading: false,

  // the single error message back from the server upon form submit
  asyncFormError: null,
  // used to show all sync errors at the bottom of a form once they click submit
  showSyncFormErrors: false,
  // are we in the process of submitting a form? used to disable form elements
  submitting: false,
}

const actions = {
  loadValues: () => ({
    type: 'CONFIG_LOAD_VALUES',
  }),
  setValues: (data) => ({
    type: 'CONFIG_SET_VALUES',
    data,
  }),
  loadAws: () => ({
    type: 'CONFIG_LOAD_AWS',
  }),
  setAws: (data) => ({
    type: 'CONFIG_SET_AWS',
    data,
  }),
  setAwsLoading: (value) => ({
    type: 'CONFIG_SET_AWS_LOADING',
    value,
  }),
  setSubmitting: (value) => ({
    type: 'CONFIG_SET_SUBMITTING',
    value,
  }),
  setAsyncFormError: (value) => ({
    type: 'CONFIG_SET_ASYNC_FORM_ERROR',
    value,
  }),
  setShowSyncFormErrors: (value) => ({
    type: 'CONFIG_SET_SHOW_SYNC_FORM_ERRORS',
    value,
  }),
  saveRemoteForm: () => ({
    type: 'CONFIG_SAVE_REMOTE_FORM',
  }),
}

const mutations = {
  CONFIG_SET_VALUES: (state, action) => {
    state.values = action.data
    state.loaded = true
  },
  CONFIG_SET_AWS: (state, action) => {
    state.aws = action.data 
  },
  CONFIG_SET_AWS_LOADING: (state, action) => {
    state.awsLoading = action.value 
  },
  CONFIG_SET_SUBMITTING: (state, action) => {
    state.submitting = action.value
  },
  CONFIG_SET_ASYNC_FORM_ERROR: (state, action) => {
    state.asyncFormError = action.value
  },
  CONFIG_SET_SHOW_SYNC_FORM_ERRORS: (state, action) => {
    state.showSyncFormErrors = action.value
  },
}

const SAGAS = sagaErrorWrapper({
  CONFIG_LOAD_VALUES: function* (){
    try{
      const response = yield call(configApi.getValues)
      yield put(auth.actions.loadStatus())
      yield put(actions.setValues(response.data))
    }
    catch(err){
      yield put(snackbar.actions.setError(err))
    }
  },
  CONFIG_LOAD_AWS: function* (){
    yield put(actions.setAwsLoading(true))
    try{
      const response = yield call(configApi.getAws)
      yield put(actions.setAws(response.data))
      yield put(actions.setAwsLoading(false))
    }
    catch(err){
      yield put(snackbar.actions.setError(err))
    }
  },
  CONFIG_SAVE_REMOTE_FORM: function* () {
    const formFields = yield select(state => selectors.form.fieldNames(state, 'remoteForm'))
    const formValues = yield select(state => selectors.form.values(state, 'remoteForm'))
    const hasError = yield select(state => selectors.form.hasError(state, 'remoteForm'))

    if(hasError) {
      yield put(actions.setShowSyncFormErrors(true))
      yield put(touch.apply(null, ['remoteForm'].concat(formFields)))
      return  
    }

    yield put(actions.setShowSyncFormErrors(false))
    yield put(actions.setAsyncFormError(null))
    yield put(actions.setSubmitting(true))

    const payload = {
      name: formValues.name,
    }

    try{
      const response = yield call(configApi.setupRemote, payload)
      yield put(auth.actions.loadStatus())
    }
    catch(err){
      yield put(snackbar.actions.setError(err))
      yield put(actions.setAsyncFormError(apiUtils.getError(err)))
    }


    yield put(actions.setSubmitting(false))
  }
})

const sagas = createSagas(SAGAS)

const module = {
  name : 'config',
  state, 
  actions, 
  mutations, 
  sagas,
}

export default module