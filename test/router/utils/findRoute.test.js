import findRoute from '../../../src/router/utils/findRoute'

const layer3 = {
  name: 'layer3',
  path: '/layer3',
}

const layer2 = {
  name: 'layer2',
  path: '/layer2',
  children: [layer3],
}

const layer1 = {
  name: 'layer1',
  path: '/layer1',
  children: [layer2],
}

const home = {
  name: 'home',
  path: '/',
}

const routes = [
  home,
  layer1,
]

test('findRoute -> layer1', () => {
  const route = findRoute(routes, 'layer1')
  expect(route).toMatchObject(layer1)
})

test('findRoute -> layer2', () => {
  const route = findRoute(routes, 'layer1.layer2')
  expect(route).toMatchObject(layer2)
})

test('findRoute -> layer3', () => {
  const route = findRoute(routes, 'layer1.layer2.layer3')
  expect(route).toMatchObject(layer3)
})

test('findRoute -> missing layer4', () => {
  const route = findRoute(routes, 'layer1.layer2.layer3.layer4')
  expect(route).toBeFalsy()
})

test('findRoute -> missing top level', () => {
  const route = findRoute(routes, 'oranges')
  expect(route).toBeFalsy()
})
