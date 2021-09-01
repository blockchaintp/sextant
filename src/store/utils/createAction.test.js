
import createAction from './createAction'

test('createAction -> standard', () => {
  const actionFactory = createAction('toggleOpen')
  const action = actionFactory(true)

  expect(action).toMatchObject({
    type: 'toggleOpen',
    payload: true,
  })
})

test('createAction -> action has type field', () => {
  const actionFactory = createAction('toggleOpen')
  expect(actionFactory.type).toBe('toggleOpen')
})
