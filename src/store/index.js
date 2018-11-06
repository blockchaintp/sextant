import { compose, applyMiddleware } from 'redux';
import { createStore } from 'redux-box'
import { reducer as formReducer }  from 'redux-form'
import { connectRoutes } from 'redux-first-router'
import createHistory from 'history/createBrowserHistory'

import { routes } from '../router'
import configModule from './config'
import clusterModule from './cluster'
import userModule from './user'
import snackbarModule from './snackbar'

const history = createHistory()
const router = connectRoutes(history, routes) 

const modules = [  
  configModule,
  clusterModule,
  userModule,
  snackbarModule,
]

const config = {
  reducers : {
    form : formReducer,
    location: router.reducer,
  },
  middlewares: [router.middleware],
  composeRedux: (composer) => (middleware) => composer(router.enhancer, middleware),
}

export default createStore(modules, config)