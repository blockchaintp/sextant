import axios from 'axios'
import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'
import api from '../utils/api'

import { actions as routerActions } from './router'

const prefix = 'user'

const initialState = {
  loaded: false,
  data: null,
  hasInitialUser: false,
  errors: {
    login: null,
    status: null,
    logout: null,
  },
}

const reducers = {
  setData: (state, action) => {
    state.loaded = true
    state.data = action.payload
    state.errors.status = null
  },
  setHasInitialUser: (state, action) => {
    state.hasInitialUser = action.payload
  },
  clearError: (state, action) => {
    state.errors[action.payload] = null
  },
  setError: (state, action) => {
    const {
      name,
      error,
    } = action.payload
    state.errors[name] = error
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
  loadStatus: () => (dispatch, getState) => {
    dispatch(actions.clearError('status'))
    Promise.all([
      loaders.status(),
      loaders.hasInitialUser(),
    ])
      .then(data => {
        const [ userStatus, hasInitialUser ] = data
        dispatch(actions.setHasInitialUser(hasInitialUser))
        dispatch(actions.setData(userStatus))
      })
      .catch(error => {
        dispatch(actions.setError({
          name: 'status',
          error: error.toString(),
        }))
      })
  },
  login: (payload) => (dispatch, getState) => {
    dispatch(actions.clearError('login'))
    loaders.login(payload)
      .then(() => loaders.status())
      .then(data => dispatch(actions.setData(data)))
      .then(() => dispatch(routerActions.navigateTo('home')))
      .catch(error => {
        dispatch(actions.setError({
          name: 'login',
          error: 'Incorrect details',
        }))
      })
  },
  logout: () => (dispatch, getState) => {
    dispatch(actions.clearError('logout'))
    loaders.logout()
      .then(() => loaders.status())
      .then(data => dispatch(actions.setData(data)))
      .then(() => dispatch(routerActions.navigateTo('login')))
      .catch(error => {
        dispatch(actions.setError({
          name: 'logout',
          error,
        }))
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