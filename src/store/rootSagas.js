import { 
  call,
  race,
  take,
  put,
  select,
  all,
} from 'redux-saga/effects'
import snackbarActions from './modules/snackbar'
import userActions from './modules/user'
import configActions from './modules/config'
import networkActions from './modules/network'
import { sagas as fileUploadSagas } from './modules/fileupload'

import selectors from './selectors'

const errorFilter = (name) => (action) => {
  const match = 
    action.type == networkActions.setError.type &&
    action.payload.name == name
  return match
}

const initialLoader = ({
  getLoaderAction,
  setDataAction,
  networkName,
  title,
}) => function* loadInitialData() {
  yield put(getLoaderAction())
  const { dataAction, errorAction } = yield race({
    dataAction: take(setDataAction.type),
    errorAction: take(errorFilter(networkName))
  })
  if(errorAction) {
    yield put(snackbarActions.setError(`${title} error: ${errorAction.payload.value}`))
    return false
  }
  else {
    return true
  }
}

const RootSagas = ({
  router,
}) => {

  const loadUserStatus = initialLoader({
    getLoaderAction: () => userActions.loadStatus(),
    setDataAction: userActions.setData,
    networkName: 'user.status',
    title: 'load user status',
  })

  const loadHasInitialUser = initialLoader({
    getLoaderAction: () => userActions.loadHasInitialUser(),
    setDataAction: userActions.setHasInitialUser,
    networkName: 'user.hasInitialUser',
    title: 'load has initial user',
  })

  const loadConfig = initialLoader({
    getLoaderAction: () => configActions.loadData(),
    setDataAction: configActions.setData,
    networkName: 'config.data',
    title: 'load config',
  })

  // called right away
  // initializes the loading of initial data from the server
  // is expected to call .start() on the router when we are ready
  function* initialize() {

    const initialLoaderResults = yield all([
      call(loadUserStatus),
      call(loadHasInitialUser),
      call(loadConfig),
    ])

    const failedLoaders = initialLoaderResults.filter(result => !result)

    // one of the loaders has failed - it will have displayed a snackbar error
    // don't carry on - this is most likely a network failure back to the api server
    if(failedLoaders.length > 0) return
    
    // do we have an initial user?
    // this decides if we force the app to the create-initial-user route
    const hasInitialUser = yield select(selectors.user.hasInitialUser)

    // we have the result of the user status
    // this means we can start the router and it will look after
    // router authentication
    if(hasInitialUser) {
      router.start()
    }
    else {
      router.start('/create-initial-user')
    }
  }

  return [
    call(initialize),
    ...fileUploadSagas,
  ]
}

export default RootSagas