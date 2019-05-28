import { applyMiddleware, createStore, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import thunk from 'redux-thunk'
import { router5Middleware } from 'redux-router5'

import SagaManager from './sagaManager'
import reducer from './reducer'

const Store = (router, initialState = {}) => {

  const sagaMiddleware = createSagaMiddleware()

  const middleware = [
    router5Middleware(router),
    thunk,
    sagaMiddleware,
  ]

  const storeEnhancers = [
    applyMiddleware(...middleware),
  ]

  if(window.__REDUX_DEVTOOLS_EXTENSION__) storeEnhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__({
    shouldHotReload: false,
  }))

  const store = createStore(
    reducer,
    initialState,
    compose(...storeEnhancers)
  )

  router.setDependency('store', store)
  SagaManager.startSagas(sagaMiddleware, router)

  if (module.hot) {
    module.hot.accept('./reducer', () => {
      store.replaceReducer(require('./reducer').default)
    })
    module.hot.accept('./sagaManager', () => {
      SagaManager.cancelSagas(store)
      require('./sagaManager').default.startSagas(sagaMiddleware, router)
    })
  }

  return store
}

export default Store