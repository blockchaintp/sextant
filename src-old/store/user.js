import { createSagas } from 'redux-box'
import { call, put, select } from 'redux-saga/effects'
import { touch, change, initialize, getFormValues } from 'redux-form'

import apiUtils from '../utils/api'
import sagaErrorWrapper from '../utils/sagaErrorWrapper'
import userApi from '../api/user'
import snackbar from './snackbar'
import auth from './auth'
import selectors from './selectors'

const state = {
  list: [],
  // the single error message back from the server upon form submit
  asyncFormError: null,
  // used to show all sync errors at the bottom of a form once they click submit
  showSyncFormErrors: false,
  // are we in the process of submitting a form? used to disable form elements
  submitting: false,
}

const actions = {
  loadList: () => ({
    type: 'USER_LOAD_LIST',
  }),
  setList: (data) => ({
    type: 'USER_SET_LIST',
    data,
  }),
  submitForm: (newUser, initialUser) => ({
    type: 'USER_SUBMIT_FORM',
    newUser,
    initialUser,
  }),
  setSubmitting: (value) => ({
    type: 'USER_SET_SUBMITTING',
    value,
  }),
  setAsyncFormError: (value) => ({
    type: 'USER_SET_ASYNC_FORM_ERROR',
    value,
  }),
  setShowSyncFormErrors: (value) => ({
    type: 'USER_SET_SHOW_SYNC_FORM_ERRORS',
    value,
  }),
  add: () => ({
    type: 'PAGE_USER_ADD',
  }),
  viewList: () => ({
    type: 'PAGE_USER_LIST',
  }),
  edit: (username) => ({
    type: 'PAGE_USER_EDIT',
    payload: {
      username,
    }
  }),
  loadEditData: () => ({
    type: 'USER_LOAD_EDIT_DATA',
  }),
  delete: (username) => ({
    type: 'USER_DELETE',
    username,
  })
}

const mutations = {
  USER_SET_LIST: (state, action) => {
    state.list = action.data
  },
  USER_SET_SUBMITTING: (state, action) => {
    state.submitting = action.value
  },
  USER_SET_ASYNC_FORM_ERROR: (state, action) => {
    state.asyncFormError = action.value
  },
  USER_SET_SHOW_SYNC_FORM_ERRORS: (state, action) => {
    state.showSyncFormErrors = action.value
  },
}

const SAGAS = sagaErrorWrapper({
  USER_LOAD_LIST: function* () {
    try{
      const response = yield call(userApi.list)
      yield put(actions.setList(response.data))
    }
    catch(err){
      yield put(snackbar.actions.setError(err))
    }
  },
  USER_SUBMIT_FORM: function* (action) {
    const formFields = yield select(state => selectors.form.fieldNames(state, 'userForm'))
    const formValues = yield select(state => selectors.form.values(state, 'userForm'))
    const hasError = yield select(state => selectors.form.hasError(state, 'userForm'))

    if(hasError) {
      yield put(actions.setShowSyncFormErrors(true))
      yield put(touch.apply(null, ['userForm'].concat(formFields)))
      return  
    }

    if(formValues.password && (formValues.password != formValues.confirm_password)) {
      yield put(actions.setAsyncFormError(`The passwords do not match`))
      return
    }

    yield put(actions.setShowSyncFormErrors(false))
    yield put(actions.setAsyncFormError(null))
    yield put(actions.setSubmitting(true))

    const payload = {
      username: formValues.username,
      type: formValues.type,
    }

    if(formValues.password) {
      payload.password = formValues.password
    }

    const apiMethod = action.newUser ? userApi.create : userApi.update

    if(!action.newUser) {
      const routerPayload = yield select(selectors.router.payload)
      payload.existingUsername = routerPayload.username
    }

    try{
      const response = yield call(apiMethod, payload)

      // if it was the initial user we re-run load status so they are redirected 
      // to the login form
      if(action.initialUser) {
        yield put(auth.actions.loadStatus())
        yield put(snackbar.actions.setMessage('Initial user created'))
      }
      else {
        yield put(snackbar.actions.setMessage(action.newUser ? 'User created' : 'User saved'))
        yield put(actions.viewList())
      }
    }
    catch(err){
      yield put(snackbar.actions.setError(err))
      yield put(actions.setAsyncFormError(apiUtils.getError(err)))
    }


    yield put(actions.setSubmitting(false))
  },
  USER_LOAD_EDIT_DATA: function* (action) {
    const payload = yield select(selectors.router.payload)
    try{
      const response = yield call(userApi.get, payload.username)
      yield put(initialize('userForm', response.data))
    }
    catch(err){
      yield put(snackbar.actions.setError(err))
    }
  },
  USER_DELETE: function* (action) {
    try{
      const response = yield call(userApi.delete, action.username)
      yield put(actions.loadList())
      yield put(snackbar.actions.setMessage(`User deleted`))
    }
    catch(err){
      yield put(snackbar.actions.setError(err))
    }
  }
})

const sagas = createSagas(SAGAS)

const module = {
  name : 'user',
  state, 
  actions, 
  mutations, 
  sagas,
}

export default module