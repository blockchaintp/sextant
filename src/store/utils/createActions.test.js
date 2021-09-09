import createActions from './createActions'

test('createActions -> standard', () => {
  const actions = createActions({
    reducers: {
      toggleOpen: (state, action) => {
        state.open = action.payload
      },
      setData: (state, action) => {
        state.data = action.payload
      },
    },
  })
  expect(actions.toggleOpen(true)).toMatchObject({
    type: 'toggleOpen',
    payload: true,
  })
  expect(actions.setData(10)).toMatchObject({
    type: 'setData',
    payload: 10,
  })
})

test('createActions -> with prefix', () => {
  const actions = createActions({
    prefix: 'apples',
    reducers: {
      toggleOpen: (state, action) => {
        state.open = action.payload
      },
      setData: (state, action) => {
        state.data = action.payload
      },
    },
  })
  expect(actions.toggleOpen(true)).toMatchObject({
    type: 'apples/toggleOpen',
    payload: true,
  })
  expect(actions.setData(10)).toMatchObject({
    type: 'apples/setData',
    payload: 10,
  })
})
