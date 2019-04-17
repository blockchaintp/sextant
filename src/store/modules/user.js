import axios from 'axios'
import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'
import api from '../utils/api'

import routerActions from './router'
import networkActions from './network'

const prefix = 'user'

const initialState = {
  loaded: false,
  data: null,
  hasInitialUser: false,
}

const reducers = {
  setData: (state, action) => {
    state.loaded = true
    state.data = action.payload
  },
  setHasInitialUser: (state, action) => {
    state.hasInitialUser = action.payload
  },
}

const loaders = {

  status: () => axios.get(api.url('/user/status'))
    .then(api.process),

  hasInitialUser: () => axios.get(api.url('/user/hasInitialUser'))
    .then(api.process),
    
  login: (payload) => axios.post(api.url('/user/login'), payload)
    .then(api.process),

  logout: () => axios.post(api.url('/user/logout'))
    .then(api.process),
    
}

const sideEffects = {
  loadStatus: () => (dispatch, getState) => api.loaderSideEffect({
    dispatch,
    loader: () => loaders.status(),
    prefix,
    name: 'status',
    dataAction: actions.setData,
  }),
  login: (payload) => (dispatch, getState) => {
    api.loaderSideEffect({
      dispatch,
      loader: () => loaders.login(payload),
      prefix,
      name: 'login',
      dataAction: actions.setData,
      returnError: true,
    })
      .then(() => dispatch(routerActions.navigateTo('home')))
      .catch(error => {
        dispatch(networkActions.setError({
          name: 'user.login',
          value: 'Incorrect details',
        }))
      })
  },
  logout: () => (dispatch, getState) => {
    api.loaderSideEffect({
      dispatch,
      loader: () => loaders.logout(),
      prefix,
      name: 'logout',
      returnError: true,
    })
      .then(() => loaders.status())
      .then(data => dispatch(actions.setData(data)))
      .then(() => dispatch(routerActions.navigateTo('login')))
      .catch(() => {})
  },
}

const reducer = CreateReducer({
  initialState,
  reducers,
  prefix,
})

const actions = CreateActions({
  reducers,
  sideEffects,
  prefix,
})

export {
  actions,
  reducer,
}

export default actions