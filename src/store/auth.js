import { createSagas } from 'redux-box'
import { call, put, select } from 'redux-saga/effects'
import { touch, change, initialize, getFormValues } from 'redux-form'

import sagaErrorWrapper from '../utils/sagaErrorWrapper'
import userApi from '../api/user'
import snackbar from './snackbar'
import selectors from './selectors'

const state = {
  loaded: false,
  userCount: null,
  userData: null,

  // the single error message back from the server upon form submit
  asyncFormError: null,
  // used to show all sync errors at the bottom of a form once they click submit
  showSyncFormErrors: false,
  // are we in the process of submitting a form? used to disable form elements
  submitting: false,
}

const actions = {
  loadStatus: () => ({
    type: 'AUTH_LOAD_STATUS',
  }),
  setStatus: (userData, userCount) => ({
    type: 'AUTH_SET_STATUS',
    userCount,
    userData,
  }),
  login: () => ({
    type: 'AUTH_LOGIN',
  }),
  setSubmitting: (value) => ({
    type: 'AUTH_SET_SUBMITTING',
    value,
  }),
  setAsyncFormError: (value) => ({
    type: 'AUTH_SET_ASYNC_FORM_ERROR',
    value,
  }),
  setShowSyncFormErrors: (value) => ({
    type: 'AUTH_SET_SHOW_SYNC_FORM_ERRORS',
    value,
  }),
}

const mutations = {
  AUTH_SET_STATUS: (state, action) => {
    state.userCount = action.userCount
    state.userData = action.userData
    state.loaded = true
  },
  AUTH_SET_SUBMITTING: (state, action) => {
    state.submitting = action.value
  },
  AUTH_SET_ASYNC_FORM_ERROR: (state, action) => {
    state.asyncFormError = action.value
  },
  AUTH_SET_SHOW_SYNC_FORM_ERRORS: (state, action) => {
    state.showSyncFormErrors = action.value
  },
}

const SAGAS = sagaErrorWrapper({
  AUTH_LOAD_STATUS: function* () {
    try{
      const response = yield call(userApi.status)
      const { data, count } = response.data
      console.log('-------------------------------------------');
      console.log('-------------------------------------------');
      console.dir(response.data)
      yield put(actions.setStatus(data, count))

      // redirect to the initial add user page if there are no users
      if(count <= 0) {
        yield put({
          type: 'PAGE_USER_ADD_INITIAL'
        })
      }
    }
    catch(err){
      yield put(snackbar.actions.setError(err))
    }
  },
  AUTH_LOGIN: function* (action) {
    const formFields = yield select(state => selectors.form.fieldNames(state, 'loginForm'))
    const formValues = yield select(state => selectors.form.values(state, 'loginForm'))
    const hasError = yield select(state => selectors.form.hasError(state, 'loginForm'))

    if(hasError) {
      yield put(actions.setShowSyncFormErrors(true))
      yield put(touch.apply(null, ['loginForm'].concat(formFields)))
      return  
    }

    yield put(actions.setShowSyncFormErrors(false))
    yield put(actions.setAsyncFormError(null))
    yield put(actions.setSubmitting(true))

    try{
      const response = yield call(userApi.login, payload)
    }
    catch(err){
      yield put(snackbar.actions.setError(err))
    }
  }
})

const sagas = createSagas(SAGAS)

const module = {
  name : 'auth',
  state, 
  actions, 
  mutations, 
  sagas,
}

export default module