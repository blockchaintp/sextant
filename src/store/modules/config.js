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
    // this is here purely so we don't have to merge the helm-charts 30 mins before a demo
    const data = action.payload
    const version = data.forms.deployment['tfs-on-sawtooth'].button.versions[0]
    version.features = version.features.concat(['taekion.explorer'])
    state.data = data
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
