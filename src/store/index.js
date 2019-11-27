import { applyMiddleware, createStore, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import thunk from 'redux-thunk'
import { router5Middleware } from 'redux-router5'
import {logger, createLogger} from 'redux-logger'

// This custom logger ignores actions dispatched as a result of loops - predicate filters out actions from the logs based on the function defined
// remove an include statement to see the associated action type logged in the console (logger must be last in chain of middleware)
// replace logger with custom logger in middleware in order to view fewer logs 
const customLogger = createLogger({
  predicate: (getState, action) => !(
    action.type.includes("Loading") || 
    action.type.includes("set") || 
    action.type.includes("@@router5") || 
    (action.type.includes('clearError') && action.payload.includes('cluster.list')) ||
    action.payload.includes("deployment.listResources") ||
    action.payload.includes("deployment.list")
  )
});

import SagaManager from './sagaManager'
import reducer from './reducer'


const Store = (router, initialState = {}) => {

  const sagaMiddleware = createSagaMiddleware()

  const middleware = [
    router5Middleware(router),
    thunk,
    sagaMiddleware,
    //logger
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