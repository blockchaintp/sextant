import {
  call,
  race,
  take,
  put,
  select,
  all,
} from 'redux-saga/effects'
import snackbarActions from './modules/snackbar'
import authActions from './modules/auth'
import userActions from './modules/user'
import configActions from './modules/config'
import networkActions from './modules/network'
import { sagas as fileUploadSagas } from './modules/fileupload'
import processRoutePath from '../router/utils/processRoutePath'
import selectors from './selectors'

const errorFilter = (name) => (action) => {
  const match = action.type === networkActions.setError.type
    && action.payload.name === name
  return match
}

const initialLoader = ({
  getLoaderAction,
  setDataAction,
  networkName,
  title,
}) => (function* loadInitialData() {
  yield put(getLoaderAction())
  const { errorAction } = yield race({
    dataAction: take(setDataAction.type),
    errorAction: take(errorFilter(networkName)),
  })
  if (errorAction) {
    yield put(snackbarActions.setError(`${title} error: ${errorAction.payload.value}`))
    return false
  }
  return true
})

const RootSagas = ({
  router,
}) => {
  const loadAuthStatus = initialLoader({
    getLoaderAction: () => authActions.loadStatus(),
    setDataAction: authActions.setData,
    networkName: 'auth.status',
    title: 'load auth status',
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
      call(loadAuthStatus),
      call(loadHasInitialUser),
    ])

    // the config route is now auth protected so only call it
    // if we detect that the user is logged in
    const isLoggedIn = yield select(selectors.auth.loggedIn)
    if (isLoggedIn) {
      yield call(loadConfig)
    }

    const failedLoaders = initialLoaderResults.filter((result) => !result)

    // one of the loaders has failed - it will have displayed a snackbar error
    // don't carry on - this is most likely a network failure back to the api server
    if (failedLoaders.length > 0) return

    // do we have an initial user?
    // this decides if we force the app to the create-initial-user route
    const hasInitialUser = yield select(selectors.user.hasInitialUser)

    // we have the result of the user status
    // this means we can start the router and it will look after
    // router authentication
    if (hasInitialUser) {
      router.start()
    } else {
      router.start(processRoutePath('/create-initial-user'))
    }
  }

  return [
    call(initialize),
    ...fileUploadSagas,
  ]
}

export default RootSagas
