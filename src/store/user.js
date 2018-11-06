import { createSagas } from 'redux-box'
import { call, put, select } from 'redux-saga/effects'

import sagaErrorWrapper from '../utils/sagaErrorWrapper'
import userApi from '../api/user'
import snackbar from './snackbar'

const state = {
  count: null,
  loaded: false,
  data: null,

  // the single error message back from the server upon form submit
  asyncFormError: null,
  // used to show all sync errors at the bottom of a form once they click submit
  showSyncFormErrors: false,
  // are we in the process of submitting a form? used to disable form elements
  submitting: false,
}

const actions = {
  loadStatus: () => ({
    type: 'USER_LOAD_STATUS',
  }),
  setStatus: (userData, userCount) => ({
    type: 'USER_SET_STATUS',
    userData,
    userCount,
  }),
}

const mutations = {
  USER_SET_STATUS: (state, action) => {
    state.data = action.userData
    state.count = action.userCount
    state.loaded = true
  },
}

const SAGAS = sagaErrorWrapper({
  USER_LOAD_STATUS: function* (){
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
    }
    catch(err){
      yield put(snackbar.actions.setError(err))
    }
  },
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