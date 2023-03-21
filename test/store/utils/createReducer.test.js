import createReducer from '../../../src/store/utils/createReducer'

const initialState = {
  open: false,
}

const reducers = {
  toggleOpen: (state, action) => {
    state.open = action.payload
  },
}

const getReducer = (prefix) => createReducer({
  initialState,
  reducers,
  prefix,
})

test('createReducer -> initial state', () => {
  const reducer = getReducer()
  expect(reducer(undefined, {})).toMatchObject(initialState)
})

test('createReducer -> toggle action', () => {
  const reducer = getReducer()
  const newState = reducer(undefined, {
    type: 'toggleOpen',
    payload: true,
  })
  expect(newState).toMatchObject({
    open: true,
  })
})

test('createReducer -> with prefix', () => {
  const reducer = getReducer('apples')
  const newState = reducer(undefined, {
    type: 'apples/toggleOpen',
    payload: true,
  })
  expect(newState).toMatchObject({
    open: true,
  })
})

test('createReducer -> with no matching action', () => {
  const reducer = createReducer({
    initialState: {
      fruit: 10,
    },
    reducers: {
      apples: (state, action) => {
        state.fruit = action.payload
      },
    },
  })

  const newState = reducer(undefined, {
    type: 'oranges',
    payload: 11,
  })

  expect(newState).toMatchObject({
    fruit: 10,
  })
})
