import { call, take, put, all, takeEvery, fork, cancel, cancelled, race, delay, select } from 'redux-saga/effects'
import { eventChannel, END } from 'redux-saga'
import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'

import selectors from '../selectors'
import snackbarActions from './snackbar'

const prefix = 'fileupload'

const initialState = {  

  // are we currently uploading
  inProgress: false,

  // details of where the files are being uploded
  //  * method
  //  * url
  //  * authHeader
  endpoint: null,

  // a map of filename onto an object with:
  //  * startime
  //  * percentDone
  //  * remainingTime (calculated by the startTime, nowTime and percentageDone)
  status: {},

  // a map of filename onto what the backend api responded with
  results: {},

  // if we had any errors uploading
  error: null,
}

const resetState = (state) => {
  state.inProgress = false
  state.endpoint = null
  state.error = null
  state.status = {}
  state.results = {}
}

const reducers = {

  // create a upload status object for each of the files being uploaded
  startUploads: (state, action) => {

    resetState(state)
    
    const {
      files,
      method,
      url,
      authHeader,
    } = action.payload

    state.endpoint = {
      method,
      url,
      authHeader,
    }

    state.inProgress = true
    state.error = null

    state.status = files.reduce((all, file) => {
      all[file.name] = {
        startTime: new Date().getTime(),
        size: file.size,
        uploadedBytes: 0,
        totalBytes: 0,
        percentDone: 0,
        remainingTime: 0,
      }
      return all
    }, {})
  },

  // update the percent uploaded for a single file
  setUploadedProgress: (state, action) => {
    const {
      filename,
      values,
    } = action.payload

    const {
      loaded,
      total,
    } = values

    const percent = Math.floor((loaded / total) * 100)

    const status = state.status[filename] || {}
    
    const timeUploading = (new Date().getTime()) - status.startTime
    const timePerPercent = percent > 0 ? timeUploading / percent : 0
    const percentLeft = 100 - percent
    const timeLeft = percentLeft * timePerPercent

    status.percentDone = percent
    status.remainingTime = timeLeft
    status.uploadedBytes = loaded
    status.totalBytes = total

    state.status[filename] = status
  },

  // update the result for a single file
  setResult: (state, action) => {
    const {
      filename,
      data,
    } = action.payload

    state.results[filename] = data
  },

  setError: (state, action) => {
    state.error = action.payload
  },

  finish: (state) => {
    state.inProgress = false
  },

  cancel: (state) => {
    state.inProgress = false
  },
}

const getFileUrlQuery = (file) => {
  const params = {
    name: file.name,
    type: file.type,
    size: file.size,
  }
  return Object.keys(params).map(key => {
    return `${key}=${encodeURIComponent(params[key])}`
  }).join('&')
}

// upload a single file to the backend api
const apiUploader = ({
  file,
  method,
  url,
  authHeader,
  onProgress,
  onComplete,
}) => {

  const xhr = new XMLHttpRequest()
  let cancelled = false

  const loader = (resolve, reject) => {
    const eventOnProgress = (e) => {
      if(cancelled) {
        return
      }
      if (e.lengthComputable) {
        onProgress(e)
      }
    }

    const eventOnFailure = (e) => {
      if(cancelled) return
      onComplete()
      return reject(e)
    }
    
    const eventOnSuccess = () => {
      if(cancelled) return
      onComplete()
      return resolve()
    }

    xhr.upload.addEventListener("progress", eventOnProgress, false)
    xhr.upload.addEventListener("error", eventOnFailure)
    xhr.upload.addEventListener("abort", eventOnSuccess)

    xhr.onreadystatechange = () => {
      if(cancelled) return
      const { readyState, status } = xhr
      if (readyState === 4) {
        const headers = xhr.getAllResponseHeaders()
        const response = headers.indexOf('content-type: application/json') >= 0 ?
          JSON.parse(xhr.response) : 
          xhr.response

        if (status < 400) {
          resolve(response)
        }
        else {
          const bodyMessage = response.error ?
            response.error :
            response
          eventOnFailure(`${status}: ${bodyMessage}`)
        }
      }
    }

    const queryParams = getFileUrlQuery(file)
    const seperator = url.indexOf('?') >= 0 ?
      '&' :
      '?'
    let useUrl = url + seperator + queryParams
    xhr.open(method || 'POST', useUrl, true)
    if(authHeader) {
      xhr.setRequestHeader('Authorization', authHeader)
    }
    xhr.send(file)
  }

  loader.cancel = () => {
    cancelled = true
    xhr.abort()
  }

  return loader
}

// return both the api promise that does the upload (based on apis/files/upload)
// and a channel that emits the percentage of the file uploaded
const createUploader = ({
  file,
  method,
  url,
  auth,
}) => {
  let emit

  const chan = eventChannel((emitter) => {
    emit = emitter
    return () => {}
  })

  const loader = apiUploader({
    file,
    method,
    url,
    auth,
    onProgress: ({ total, loaded }) => {
      emit({
        loaded,
        total,
      })
      if (loaded >= total) emit(END)
    },
    onComplete: () => emit(END)
  })

  // return the uploader promise and progress channel
  return {
    chan,
    loader,
    uploadPromise: new Promise(loader),
  }
}

// a progress watcher than is passed file information and a channel that
// will emit the percentage uploaded for that file
// this is in a fork so the while(true) is ok
function* uploadProgressWatcher(filename, chan) {
  while (true) {
    const values = yield take(chan)
    yield put(actions.setUploadedProgress({
      filename,
      values,
    }))
  }
}

// saga to upload a single file by forking on the uploadProgressWatcher
// and then calling the upload api promise
function* uploadFile({
  file,
  method,
  url,
  authHeader,
}) {
  const {
    uploadPromise,
    loader,
    chan
  } = yield call(createUploader, {
    file,
    method,
    url,
    authHeader,
  })

  let progressTask = null
  try {
    progressTask = yield fork(uploadProgressWatcher, file.name, chan)
    const result = yield call(() => uploadPromise)
    yield put(actions.setResult({
      filename: file.name,
      data: result,
    }))
  }
  catch(e) {
    yield put(snackbarActions.setError(e))
    yield put(actions.setError(e))
  }
  finally {
    if (yield cancelled()) {
      loader.cancel()
    }
  }
  
  yield cancel(progressTask)
}

// saga to upload multiple files based on the given action
function* uploadFiles(action) {
  const {
    files,
    method,
    url,
    authHeader,
    onComplete,
    onError,
  } = action.payload

  const uploadSagas = files.map(file => call(uploadFile, {
    file,
    method,
    url,
    authHeader,
  }))

  const {
    upload,
    cancel,
  } = yield race({
    upload: all(uploadSagas),
    cancel: take(`${prefix}/cancel`),
  })

  if(upload) {
    yield delay(1000)
    const results = yield select(selectors.fileupload.results)
    const uploadError = yield select(selectors.fileupload.error)
    if(uploadError) {
      if(onError) onError(uploadError)
    }
    else {
      if(onComplete) onComplete(results)
    }
    
    yield put(actions.finish())
  }
}

const reducer = CreateReducer({
  initialState,
  reducers,
  prefix,
})

const actions = CreateActions({
  reducers,
  prefix,
})

const sagas = [
  takeEvery(`${prefix}/startUploads`, uploadFiles),
]

export {
  actions,
  reducer,
  sagas,
}

export default actions