import { createSagas } from 'redux-box'
import { call, put, select } from 'redux-saga/effects'

import sagaErrorWrapper from '../utils/sagaErrorWrapper'
import userApi from '../api/user'
import snackbar from './snackbar'

const state = {
  count: null,
  loaded: false,
  data: null,
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