/* eslint-disable arrow-body-style */
import axios from 'axios'
import { normalize, schema } from 'normalizr'
import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'
import { mergeEntities } from '../utils/mergeNormalized'
import api from '../utils/api'

import selectors from '../selectors'
import routerActions from './router'
import snackbarActions from './snackbar'

const prefix = 'user'

const user = new schema.Entity('user')

const DEFAUT_ACCESS_LEVEL = 'read'

const initialState = {
  hasInitialUser: false,
  users: normalize([], [user]),
  accessToken: null,
  accessControlFormOpen: false,
  accessControlLevel: DEFAUT_ACCESS_LEVEL,
  accessControlSearch: '',
  accessControlResults: [],
  accessUserList: [],
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
  setAccessToken: (state, action) => {
    state.accessToken = action.payload
  },
  setAccessControlFormOpen: (state, action) => {
    state.accessControlFormOpen = action.payload
  },
  setAccessControlLevel: (state, action) => {
    state.accessControlLevel = action.payload
  },
  setAccessControlSearch: (state, action) => {
    const value = typeof (action.payload) === 'object'
      ? action.payload.username
      : action.payload
    state.accessControlSearch = value
  },
  setAccessControlResults: (state, action) => {
    state.accessControlResults = action.payload
  },
  closeAccessControlForm: (state) => {
    state.accessControlFormOpen = false
    state.accessControlSearch = ''
    state.accessControlResults = []
    state.accessControlLevel = DEFAUT_ACCESS_LEVEL
  },
}

const loaders = {

  hasInitialUser: () => axios.get(api.url('/user/hasInitialUser'))
    .then(api.process),

  list: () => axios.get(api.url('/user'))
    .then(api.process),

  get: (id) => axios.get(api.url(`/user/${id}`))
    .then(api.process),

  create: (payload) => axios.post(api.url('/user'), payload)
    .then(api.process),

  update: (id, payload) => axios.put(api.url(`/user/${id}`), payload)
    .then(api.process),

  delete: (id) => axios.delete(api.url(`/user/${id}`))
    .then(api.process),

  getAccessToken: (id) => axios.get(api.url(`/user/${id}/token`))
    .then(api.process)
    .then((data) => data.token),

  refreshAccessToken: (id) => axios.put(api.url(`/user/${id}/token`))
    .then(api.process),

  loadAccessControlResults: (search) => axios.get(api.url('/user/search'), {
    params: {
      search,
    },
  })
    .then(api.process),

}

const sideEffects = {
  loadHasInitialUser: () => (dispatch) => api.loaderSideEffect({
    dispatch,
    loader: () => loaders.hasInitialUser(),
    prefix,
    name: 'hasInitialUser',
    dataAction: actions.setHasInitialUser,
  }),
  list: () => (dispatch) => api.loaderSideEffect({
    dispatch,
    loader: () => loaders.list(),
    prefix,
    name: 'list',
    dataAction: actions.setUsers,
    snackbarError: true,
  }),
  get: (id) => (dispatch) => api.loaderSideEffect({
    dispatch,
    loader: () => loaders.get(id),
    prefix,
    name: 'get',
    dataAction: actions.setUser,
    snackbarError: true,
  }),
  delete: (id) => async (dispatch) => {
    try {
      await api.loaderSideEffect({
        dispatch,
        loader: () => loaders.delete(id),
        prefix,
        name: 'delete',
        returnError: true,
      })
      dispatch(snackbarActions.setSuccess('user deleted'))
      dispatch(actions.list())
    } catch (e) {
      dispatch(snackbarActions.setError(`error deleting user: ${e.toString()}`))
    }
  },
  create: (payload) => (dispatch) => {
    return api.loaderSideEffect({
      dispatch,
      loader: () => loaders.create({
        username: payload.username,
        password: payload.password,
        permission: payload.permission,
      }),
      prefix,
      name: 'form',
      returnError: true,
    })
  },
  createInitial: (payload) => async (dispatch) => {
    try {
      await dispatch(actions.create(payload))
      dispatch(snackbarActions.setSuccess('initial user created'))
      dispatch(routerActions.navigateTo('login'))
    } catch (e) {
      dispatch(snackbarActions.setError(`error creating initial user: ${e.toString()}`))
    }
  },
  createNew: (payload) => async (dispatch) => {
    try {
      await dispatch(actions.create(payload))
      dispatch(snackbarActions.setSuccess('user created'))
      dispatch(routerActions.navigateTo('users'))
    } catch (e) {
      dispatch(snackbarActions.setError(`error creating user: ${e.toString()}`))
    }
  },
  save: (id, payload) => async (dispatch) => {
    try {
      await api.loaderSideEffect({
        dispatch,
        loader: () => loaders.update(id, {
          username: payload.username,
          password: payload.password,
          permission: payload.permission,
        }),
        prefix,
        name: 'form',
        returnError: true,
      })
      dispatch(snackbarActions.setSuccess('user saved'))
      dispatch(routerActions.navigateTo('users'))
    } catch (e) {
      dispatch(snackbarActions.setError(`error saving user: ${e.toString()}`))
    }
  },
  saveAccountDetails: (payload) => async (dispatch, getState) => {
    const userData = selectors.auth.data(getState())
    try {
      await api.loaderSideEffect({
        dispatch,
        loader: () => loaders.update(userData.id, {
          username: payload.username,
          password: payload.password,
        }),
        prefix,
        name: 'form',
        returnError: true,
      })
      dispatch(snackbarActions.setSuccess('account details saved'))
      dispatch(routerActions.navigateTo('home'))
    } catch (e) {
      dispatch(snackbarActions.setError(`error saving account details: ${e.toString()}`))
    }
  },
  submitForm: (payload) => (dispatch, getState) => {
    const id = selectors.router.idParam(getState())
    if (id === 'new') {
      dispatch(actions.createNew(payload))
    } else {
      dispatch(actions.save(id, payload))
    }
  },
  getAccessToken: () => async (dispatch, getState) => {
    const userData = selectors.auth.data(getState())
    await api.loaderSideEffect({
      dispatch,
      loader: () => loaders.getAccessToken(userData.id),
      prefix,
      name: 'getAccessToken',
      dataAction: actions.setAccessToken,
      snackbarError: true,
    })
  },
  refreshAccessToken: () => async (dispatch, getState) => {
    const userData = selectors.auth.data(getState())
    try {
      await api.loaderSideEffect({
        dispatch,
        loader: () => loaders.refreshAccessToken(userData.id),
        prefix,
        name: 'refreshAccessToken',
        returnError: true,
      })
      await dispatch(actions.getAccessToken())
      dispatch(snackbarActions.setSuccess('access token refreshed'))
    } catch (e) {
      dispatch(snackbarActions.setError(`error updating access token: ${e.toString()}`))
    }
  },
  loadAccessControlResults: (search) => async (dispatch) => api.loaderSideEffect({
    dispatch,
    loader: () => loaders.loadAccessControlResults(search),
    prefix,
    name: 'loadAccessControlResults',
    dataAction: actions.setAccessControlResults,
    snackbarError: true,
  }),
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
