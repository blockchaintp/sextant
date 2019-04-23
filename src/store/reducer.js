import { combineReducers } from 'redux'

import { reducer as router } from './modules/router'
import { reducer as snackbar } from './modules/snackbar'
import { reducer as auth } from './modules/auth'
import { reducer as user } from './modules/user'
import { reducer as cluster } from './modules/cluster'
import { reducer as network } from './modules/network'
import { reducer as config } from './modules/config'
import { reducer as fileupload } from './modules/fileupload'

const reducers = {
  router,
  snackbar,
  auth,
  user,
  cluster,
  network,
  config,
  fileupload,
}

export default combineReducers(reducers)
