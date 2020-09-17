import { combineReducers } from 'redux'

import { reducer as router } from './modules/router'
import { reducer as snackbar } from './modules/snackbar'
import { reducer as auth } from './modules/auth'
import { reducer as user } from './modules/user'
import { reducer as cluster } from './modules/cluster'
import { reducer as deployment } from './modules/deployment'
import { reducer as deploymentSettings } from './modules/deploymentSettings'
import { reducer as network } from './modules/network'
import { reducer as config } from './modules/config'
import { reducer as fileupload } from './modules/fileupload'
import { reducer as customization } from './modules/customization'
import { reducer as taekion } from './modules/taekion'
import { reducer as administration } from './modules/administration'

const reducers = {
  router,
  snackbar,
  auth,
  user,
  cluster,
  deployment,
  deploymentSettings,
  network,
  config,
  fileupload,
  customization,
  taekion,
  administration,
}

export default combineReducers(reducers)
