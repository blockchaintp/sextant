import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'

const prefix = 'customization'

const initialState = {
  yamlInput: 0,
}

const reducers = {
  setYamlInput: (state, action) => {
    state.yamlInput = action.payload
  },
}

const sideEffects = {
  saveYamlInput: (yamlInput) => (dispatch) => {
    dispatch(actions.setYamlInput(yamlInput))
  },
  clearYamlInput: () => (dispatch) => {
    dispatch(actions.setYamlInput(0))
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

export { actions, reducer }
export default actions 