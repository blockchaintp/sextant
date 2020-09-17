import axios from 'axios'
import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'
import api from '../utils/api'

const prefix = 'administration'

const initialState = {
  restarting: false,
}

const reducers = {
  setRestarting: (state, action) => {
    state.restarting = action.payload
  },
}

const loaders = {
  getStartTime: () => axios.get(api.url('/administration/startTime'))
    .then(api.process),
  restart: () => axios.post(api.url('/administration/restart'))
    .then(api.process),
}

const sideEffects = {

  startTime: () => (dispatch) => api.loaderSideEffect({
    dispatch,
    loader: () => loaders.getStartTime(),
  }),
  triggerRestart: () => (dispatch) => api.loaderSideEffect({
    dispatch,
    loader: () => loaders.restart(),
  }),

  restart: () => async (dispatch) => {
    dispatch(actions.setRestarting(true))

    const initialStartTime = await dispatch(actions.startTime())
    try {
      await dispatch(actions.triggerRestart())
    } catch (error) {
      error.log(error)
    }

    let hasRestarted = false
    while (!hasRestarted) {
      try {
        const currentCheck = await dispatch(actions.startTime())
        if (currentCheck !== initialStartTime) hasRestarted = true
      } catch (error) {
        console.log(' server error expected during administration restart', error);
      }
    }
    dispatch(actions.setRestarting(false))
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
