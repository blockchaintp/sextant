import { call, race, take, put, takeEvery } from 'redux-saga/effects'
import snackbarActions from './modules/snackbar'
import userActions from './modules/user'
import { sagas as fileUploadSagas } from './modules/fileupload'

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
    
    // we have the result of the user status
    // this means we can start the router and it will look after
    // router authentication
    router.start()
  }

  return [
    call(initialize),
    ...fileUploadSagas,
  ]
}

export default RootSagas