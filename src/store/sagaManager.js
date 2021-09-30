import { take, cancel } from 'redux-saga/effects'
import Sagas from './rootSagas'

export const CANCEL_SAGAS_HMR = 'CANCEL_SAGAS_HMR'

function createAbortableSaga(sagaEffect) {
  if (process.env.NODE_ENV === 'development') {
    return function* main() {
      const sagaTask = yield sagaEffect
      yield take(CANCEL_SAGAS_HMR)
      yield cancel(sagaTask)
    }
  }
  return function* main() {
    yield sagaEffect
  }
}

const SagaManager = {
  startSagas(sagaMiddleware, router) {
    const sagas = Sagas({
      router,
    })
    sagas.map(createAbortableSaga).forEach((sagaEffect) => sagaMiddleware.run(sagaEffect))
  },

  cancelSagas(store) {
    store.dispatch({
      type: CANCEL_SAGAS_HMR,
    })
  },
}

export default SagaManager
