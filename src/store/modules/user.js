import axios from 'axios'
import { normalize, schema } from 'normalizr'
import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'
import { mergeEntities, mergeAll } from '../utils/mergeNormalized'
import api from '../utils/api'

import routerActions from './router'
import snackbarActions from './snackbar'

const prefix = 'user'

const user = new schema.Entity('user')

const initialState = {
  hasInitialUser: false,
  users: normalize([], [user]),
}

const reducers = {
  setHasInitialUser: (state, action) => {
    state.hasInitialUser = action.payload
  },
  setUsers: (state, action) => {
    state.users = normalize(action.payload, [user])
  },
  setUser: (state, action) => {
    mergeEntities(state.users, normalize([action.payload], [user]))
  },
}

const loaders = {

  hasInitialUser: () => axios.get(api.url(`/user/hasInitialUser`))
    .then(api.process),

  create: (payload) => axios.post(api.url(`/user`), payload)
    .then(api.process),

  getUsers: () => axios.get(api.url(`/user`))
    .then(api.process),

  getUser: (id) => axios.get(api.url(`/user/${id}`))
    .then(api.process),
    
}

const sideEffects = {
  loadHasInitialUser: () => (dispatch, getState) => api.loaderSideEffect({
    dispatch,
    loader: () => loaders.hasInitialUser(),
    prefix,
    name: 'hasInitialUser',
    dataAction: actions.setHasInitialUser,
  }),
  loadUsers: () => (dispatch) => api.loaderSideEffect({
    dispatch,
    loader: () => loaders.getUsers(),
    prefix,
    name: 'users',
    dataAction: actions.setUsers,
    snackbarError: true,
  }),
  loadUser: (id) => (dispatch) => api.loaderSideEffect({
    dispatch,
    loader: () => loaders.getUser(id),
    prefix,
    name: 'user',
    dataAction: actions.setUser,
    snackbarError: true,
  }),
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