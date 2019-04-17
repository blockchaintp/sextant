import { call, race, take, put, select } from 'redux-saga/effects'
import snackbarActions from './modules/snackbar'
import userActions from './modules/user'
import { sagas as fileUploadSagas } from './modules/fileupload'

import selectors from './selectors'

const RootSagas = ({
  router,
}) => {

  function* userStatusLoad() {
    // as soon as the app is loaded
    // load the user logged in status
    yield put(userActions.loadStatus())

    // wait for one of the user status data or an error
    const { dataAction, errorAction } = yield race({
      dataAction: take(userActions.setData.type),
      errorAction: take(userActions.setError.type),
    })

    // if there was an error loading the user status
    // we cannot continue - probably the network is
    // broken between the frontend and backend
    // let's trigger an error snackbar
    if(errorAction) {
      yield put(snackbarActions.setError(`user status: ${errorAction.payload.error}`))
      return
    }
  }

  // called right away - is expected to call .start()
  // on the router when we are ready
  function* initialize() {
    yield call(userStatusLoad)

    // do we have an initial user?
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