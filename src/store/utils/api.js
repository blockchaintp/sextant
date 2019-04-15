import settings from 'settings'

import snackbarActions from '../modules/snackbar'

const url = (path) => [settings.api, path].join('/').replace(/\/+/g, '/')

// catch bad status codes and run an error handler
// otherwise return the data property of the response
const process = res => {
  if(res.status >= 400) return Promise.reject(`status: ${res.status}`)
  return res.data
}

const loaderSideEffect = ({
  dispatch,
  actions,
  name,
  dataAction,
  loader,
  returnError,
  snackbarError,
}) => {
  dispatch(actions.clearError(name))
  dispatch(actions.setLoading(name))
  return loader()
    .then(data => {
      if(dataAction) {
        dispatch(dataAction(data))
      }
      dispatch(actions.clearLoading(name))
      return data
    })
    .catch(error => {

      // pluck an error message from the response body if present
      let useErrorMessage = error.toString()
      const res = error.response
      if(res && res.data && res.data.error) useErrorMessage = res.data.error

      dispatch(actions.setError({
        name: name,
        error: useErrorMessage,
      }))
      dispatch(actions.clearLoading(name))
      if(snackbarError) {
        dispatch(snackbarActions.setError(useErrorMessage))
      }
      if(returnError) return Promise.reject(useErrorMessage)
    })
}

const api = {
  url,
  process,
  loaderSideEffect,
}

export default api