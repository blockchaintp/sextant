import axios from 'axios'
import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'
import api from '../utils/api'

import routerActions from './router'
import networkActions from './network'
import snackbarActions from './snackbar'

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

  logout: () => axios.get(api.url('/user/logout'))
    .then(api.process),

  create: (payload) => axios.post(api.url('/user'), payload)
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
  loadHasInitialUser: () => (dispatch, getState) => api.loaderSideEffect({
    dispatch,
    loader: () => loaders.hasInitialUser(),
    prefix,
    name: 'hasInitialUser',
    dataAction: actions.setHasInitialUser,
  }),
  login: (payload) => async (dispatch, getState) => {
    try {
      const result = await api.loaderSideEffect({
        dispatch,
        loader: () => loaders.login(payload),
        prefix,
        name: 'login',
        returnError: true,
      })
      
      if(!result.ok) throw new Error('unexpected result from login')
      await dispatch(actions.loadStatus())
      dispatch(routerActions.navigateTo('home'))
    } catch(err) {
      dispatch(networkActions.setError({
        name: 'user.login',
        value: 'Incorrect details',
      }))
    }
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
  createInitial: (payload) => async (dispatch, getState) => {
    try {
      await dispatch(actions.create(payload))
      dispatch(snackbarActions.setSuccess(`initial user created`))
      dispatch(routerActions.navigateTo('login'))
    } catch(e) {
      dispatch(snackbarActions.setError(`error creating initial user: ${e.toString()}`))
    }
  },
  create: (payload) => (dispatch, getState) => {
    return api.loaderSideEffect({
      dispatch,
      loader: () => loaders.create({
        username: payload.username,
        password: payload.password,
        permission: payload.permission,
      }),
      prefix,
      name: 'create',
      returnError: true,
    })
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