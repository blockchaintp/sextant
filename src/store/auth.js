import { createSagas } from 'redux-box'
import { call, put, select } from 'redux-saga/effects'
import { touch, change, initialize, getFormValues } from 'redux-form'

import apiUtils from '../utils/api'
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
  logout: () => ({
    type: 'AUTH_LOGOUT',
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
      yield put(actions.setStatus(data, count))

      // redirect to the initial add user page if there are no users
      if(count <= 0) {
        yield put({
          type: 'PAGE_USER_ADD_INITIAL'
        })
      }
      // if there is no logged-in user - redirect to the login form
      else if(!data) {
        yield put({
          type: 'PAGE_LOGIN'
        })
      }
      // otherwise if there is a logged in user - interrogate the current route
      // to check if it's a non-logged in page and redirect to the cluster list
      // if not - this means links to deep pages can be shared and we don't
      // force a redirect to the cluster list each time
      else {
        const currentRoute = yield select(selectors.router.currentRoute)
        if(currentRoute.guestPage) {
          yield put({
            type: 'PAGE_CLUSTER_LIST'
          })  
        }
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
      const response = yield call(userApi.login, formValues)

      console.log('-------------------------------------------');
      console.log('-------------------------------------------');
      console.dir(response.statusCode)
      console.dir(response.data)
    }
    catch(err){
      yield put(snackbar.actions.setError(err))
      yield put(actions.setAsyncFormError(apiUtils.getError(err)))
    }

    yield put(actions.setSubmitting(false))
  },
  AUTH_LOGOUT: function* () {
    try{
      const response = yield call(userApi.logout)
    }
    catch(err){
      yield put(snackbar.actions.setError(err))
    }

    yield put(actions.loadStatus())
  },
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