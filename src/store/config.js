import { createSagas } from 'redux-box'
import { call, put, select } from 'redux-saga/effects'

import sagaErrorWrapper from '../utils/sagaErrorWrapper'
import configApi from '../api/config'
import snackbar from './snackbar'

const state = {
  values: {},
  loaded: false,
  aws: {},
  awsLoading: false,
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
  })
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