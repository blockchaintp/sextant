import axios from 'axios'
import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'
import api from '../utils/api'

const prefix = 'config'

const initialState = {
  data: null,
}

const reducers = {
  setData: (state, action) => {
    state.data = action.payload
  },
}

const loaders = {
  getData: () => axios.get(api.url('/config/values'))
    .then(api.process),
}

const sideEffects = {

  loadData: () => (dispatch) => api.loaderSideEffect({
    dispatch,
    loader: () => loaders.getData(),
    prefix,
    name: 'data',
    dataAction: actions.setData,
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
