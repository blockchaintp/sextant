import settings from 'settings'

import authActions from '../modules/auth'
import clusterActions from '../modules/cluster'
import deploymentActions from '../modules/deployment'
import networkActions from '../modules/network'
import snackbarActions from '../modules/snackbar'

const url = (path) => [window.SEXTANT_ROOT_PATH, settings.api, path].join('/').replace(/\/+/g, '/')

// catch bad status codes and run an error handler
// otherwise return the data property of the response
const process = (res) => {
  if (res.status >= 400) {
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject(`status: ${res.status}`)
  }
  return res.data
}

const loaderSideEffect = ({
  dispatch,
  prefix,
  name,
  dataAction,
  loader,
  returnError,
  snackbarError,
  setCluster,
}) => {
  const networkName = [prefix, name]
    .filter((s) => s)
    .join('.')

  dispatch(networkActions.clearError(networkName))
  dispatch(networkActions.startLoading(networkName))

  return loader()
    .then((data) => {
      if (dataAction) {
        dispatch(dataAction(data))
      }
      if (setCluster) {
        dispatch(setCluster)
      }
      dispatch(networkActions.stopLoading(networkName))
      return data
    })
    // eslint-disable-next-line consistent-return
    .catch((error) => {
      // pluck an error message from the response body if present
      let useErrorMessage = error.toString()
      const res = error.response

      if (res && res.data && res.data.error) useErrorMessage = res.data.error
      dispatch(networkActions.setError({
        name: networkName,
        value: useErrorMessage,
      }))
      dispatch(networkActions.stopLoading(networkName))
      if (snackbarError) {
        dispatch(snackbarActions.setError(useErrorMessage))
      }

      if (res && res.data.reset) {
        dispatch(authActions.reset())
        // stop background looping AJAX operations
        dispatch(clusterActions.stopClusterLoop())
        dispatch(deploymentActions.stopDeploymentLoop())
        dispatch(deploymentActions.stopResourcesLoop())
      }
      if (returnError) { return Promise.reject(useErrorMessage) }
    })
}

const api = {
  url,
  process,
  loaderSideEffect,
}

export default api
