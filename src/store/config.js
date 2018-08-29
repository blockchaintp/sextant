import { createSagas } from 'redux-box'
import { call, put, select } from 'redux-saga/effects'

import sagaErrorWrapper from '../utils/sagaErrorWrapper'
import configApi from '../api/config'
import snackbar from './snackbar'

const state = {
  values: {},
  loaded: false,
}

const actions = {
  loadValues: () => ({
    type: 'CONFIG_LOAD_VALUES',
  }),
  setValues: (data) => ({
    type: 'CONFIG_SET_VALUES',
    data,
  }),
}

const mutations = {
  CONFIG_SET_VALUES: (state, action) => {
    state.values = action.data
    state.loaded = true
  },
}

const SAGAS = sagaErrorWrapper({
  CONFIG_LOAD_VALUES: function* (){
    try{
      const response = yield call(configApi.getValues)
      yield put(actions.setValues(response.data))
    }
    catch(err){
      yield put(snackbar.actions.setError(err))
    }
  },
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