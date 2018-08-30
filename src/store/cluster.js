import { createSagas } from 'redux-box'
import { call, put, select } from 'redux-saga/effects'

import sagaErrorWrapper from '../utils/sagaErrorWrapper'
import clusterApi from '../api/cluster'
import snackbar from './snackbar'

const state = {
  list: [],
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
  })
}

const mutations = {
  CLUSTER_SET_LIST: (state, action) => {
    state.list = action.data
  },
}

const SAGAS = sagaErrorWrapper({
  CLUSTER_LOAD_LIST: function* (){
    try{
      const response = yield call(clusterApi.list)
      yield put(actions.setList(response.data))
    }
    catch(err){
      yield put(snackbar.actions.setError(err))
    }
  },
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