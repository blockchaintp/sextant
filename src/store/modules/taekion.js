import axios from 'axios'
import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'
import api from '../utils/api'

import snackbarActions from './snackbar'
import networkActions from './network'

import selectors from '../selectors'

const prefix = 'taekion'

const initialState = {
  keys: [],
  volumes: [],
  snapshots: [],
  addKeyWindowOpen: false,
  addKeyResult: null,
  addVolumeWindowOpen: false,
  addSnapshotWindowOpen: false,
  explorerDirectories: {},
  explorerNodes: {},
  explorerNodesLoading: {},
}

const reducers = {
  setKeys: (state, action) => {
    state.keys = action.payload
  },
  setVolumes: (state, action) => {
    state.volumes = action.payload
  },
  setSnapshots: (state, action) => {
    state.snapshots = action.payload
  },
  setAddKeyWindowOpen: (state, action) => {
    state.addKeyWindowOpen = action.payload
  },
  setAddKeyResult: (state, action) => {
    state.addKeyResult = action.payload
  },
  setAddVolumeWindowOpen: (state, action) => {
    state.addVolumeWindowOpen = action.payload
  },
  setAddSnapshotWindowOpen: (state, action) => {
    state.addSnapshotWindowOpen = action.payload
  },
  resetExplorer: (state, action) => {
    state.explorerNodes = {}
    state.explorerDirectories = {}
    state.explorerNodesLoading = {}
  },
  setExplorerDirectory: (state, action) => {
    const {
      id,
      data,
    } = action.payload
    data.forEach(node => {
      state.explorerNodes[node.inodeid] = node
    })
    state.explorerDirectories[id] = data
  },
  setExplorerNodeLoading: (state, action) => {
    const {
      id,
      value,
    } = action.payload
    state.explorerNodesLoading[id] = value
  },
}

const loaders = {

  listKeys: ({
    cluster,
    deployment,
  }) => axios.get(api.url(`/clusters/${cluster}/deployments/${deployment}/taekion/keys`))
    .then(api.process),

  createKey: ({
    cluster,
    deployment,
    payload,
  }) => axios.post(api.url(`/clusters/${cluster}/deployments/${deployment}/taekion/keys`), payload)
    .then(api.process),

  deleteKey: ({
    cluster,
    deployment,
    id,
  }) => axios.delete(api.url(`/clusters/${cluster}/deployments/${deployment}/taekion/keys/${id}`))
    .then(api.process),

  listVolumes: ({
    cluster,
    deployment,
  }) => axios.get(api.url(`/clusters/${cluster}/deployments/${deployment}/taekion/volumes`))
    .then(api.process),

  createVolume: ({
    cluster,
    deployment,
    payload,
  }) => axios.post(api.url(`/clusters/${cluster}/deployments/${deployment}/taekion/volumes`), payload)
    .then(api.process),

  updateVolume: ({
    cluster,
    deployment,
    volume,
    payload,
  }) => axios.put(api.url(`/clusters/${cluster}/deployments/${deployment}/taekion/volumes/${volume}`), payload)
    .then(api.process),

  deleteVolume: ({
    cluster,
    deployment,
    name,
  }) => axios.delete(api.url(`/clusters/${cluster}/deployments/${deployment}/taekion/volumes/${name}`))
    .then(api.process),

  listSnapshots: ({
    cluster,
    deployment,
    volume,
  }) => axios.get(api.url(`/clusters/${cluster}/deployments/${deployment}/taekion/volumes/${volume}/snapshots`))
    .then(api.process),

  createSnapshot: ({
    cluster,
    deployment,
    volume,
    payload,
  }) => axios.post(api.url(`/clusters/${cluster}/deployments/${deployment}/taekion/volumes/${volume}/snapshots`), payload)
    .then(api.process),

  deleteSnapshot: ({
    cluster,
    deployment,
    volume,
    snapshotName,
  }) => axios.delete(api.url(`/clusters/${cluster}/deployments/${deployment}/taekion/volumes/${volume}/snapshots/${snapshotName}`))
    .then(api.process),

  explorerListDirectory: ({
    cluster,
    deployment,
    volume,
    inode,
  }) => axios.get(api.url(`/clusters/${cluster}/deployments/${deployment}/taekion/explorer/${volume}/dir/${inode}`))
    .then(api.process),


}

// wrap all taekion api calls
// so we can detect a "pod not ready" error
// and show a "loading" overlay rather
// than a nasty red snackbar
const taekionApiWrapper = async ({
  name = 'taekion api request',
  globalLoading = false,
  apiHandler,
  dispatch,
}) => {
  if(globalLoading) dispatch(networkActions.setGlobalLoading(true))
  try {
    await apiHandler()
  } catch(e) {
    if(e.toString().indexOf('connect:') > 0) {
      dispatch(snackbarActions.setInfo(`the taekion cluster is still starting up, please refresh in a few minutes`))
    }
    else {
      dispatch(snackbarActions.setError(`error for ${name}: ${e.toString()}`))
    }
  }
  if(globalLoading) dispatch(networkActions.setGlobalLoading(false))
}

const sideEffects = {

  listKeys: ({
    cluster,
    deployment,
  }) => (dispatch, getState) => taekionApiWrapper({
    name: 'list keys',
    dispatch,
    apiHandler: () => api.loaderSideEffect({
      dispatch,
      loader: () => loaders.listKeys({cluster, deployment}),
      prefix,
      name: 'listKeys',
      dataAction: actions.setKeys,
      snackbarError: true,
      returnError: true,
    })
  }),

  createKey: ({
    cluster,
    deployment,
    payload,
  }) => async (dispatch, getState) => {

    await taekionApiWrapper({
      name: 'create key',
      globalLoading: true,
      dispatch,
      apiHandler: async () => {
        const data = await api.loaderSideEffect({
          dispatch,
          loader: () => loaders.createKey({cluster, deployment, payload}),
          prefix,
          name: 'createKey',
          returnError: true,
        })
        dispatch(actions.listKeys({
          cluster,
          deployment,
        }))
        dispatch(snackbarActions.setSuccess(`key added`))
        dispatch(actions.setAddKeyResult(data))
        dispatch(actions.setAddKeyWindowOpen(false))
      }
    })
  },

  deleteKey: ({
    cluster,
    deployment,
    id,
  }) => async (dispatch, getState) => {

    await taekionApiWrapper({
      name: 'delete key',
      globalLoading: true,
      dispatch,
      apiHandler: async () => {
        await api.loaderSideEffect({
          dispatch,
          loader: () => loaders.deleteKey({cluster, deployment, id}),
          prefix,
          name: 'deleteKey',
          returnError: true,
        })
        dispatch(actions.listKeys({
          cluster,
          deployment,
        }))
        dispatch(snackbarActions.setSuccess(`key deleted`))
      }
    })

  },

  listVolumes: ({
    cluster,
    deployment,
  }) => (dispatch, getState) => taekionApiWrapper({
    name: 'list volumes',
    dispatch,
    apiHandler: () => api.loaderSideEffect({
      dispatch,
      loader: () => loaders.listVolumes({cluster, deployment}),
      prefix,
      name: 'listVolumes',
      dataAction: actions.setVolumes,
      snackbarError: false,
      returnError: true,
    })
  }),

  createVolume: ({
    cluster,
    deployment,
    payload,
  }) => async (dispatch, getState) => {

    await taekionApiWrapper({
      name: 'create volume',
      globalLoading: true,
      dispatch,
      apiHandler: async () => {
        await api.loaderSideEffect({
          dispatch,
          loader: () => loaders.createVolume({cluster, deployment, payload}),
          prefix,
          name: 'createVolume',
          returnError: true,
        })
        await dispatch(actions.listVolumes({
          cluster,
          deployment,
        }))
        dispatch(snackbarActions.setSuccess(`volume added`))
        dispatch(actions.setAddVolumeWindowOpen(false))
      }
    })

  },

  updateVolume: ({
    cluster,
    deployment,
    volume,
    payload,
  }) => async (dispatch, getState) => {

    await taekionApiWrapper({
      name: 'update volume',
      globalLoading: true,
      dispatch,
      apiHandler: async () => {
        await api.loaderSideEffect({
          dispatch,
          loader: () => loaders.updateVolume({ cluster, deployment, volume, payload }),
          prefix,
          name: 'updateVolume',
          returnError: true,
        })
        await dispatch(actions.listVolumes({
          cluster,
          deployment,
        }))
        dispatch(snackbarActions.setSuccess(`volume updated`))
        dispatch(actions.setAddVolumeWindowOpen(false))
      }
    })

  },

  deleteVolume: ({
    cluster,
    deployment,
    name,
  }) => async (dispatch, getState) => {

    await taekionApiWrapper({
      name: 'delete volume',
      globalLoading: true,
      dispatch,
      apiHandler: async () => {
        await api.loaderSideEffect({
          dispatch,
          loader: () => loaders.deleteVolume({cluster, deployment, name}),
          prefix,
          name: 'deleteVolume',
          returnError: true,
        })
        await dispatch(actions.listVolumes({
          cluster,
          deployment,
        }))
        dispatch(snackbarActions.setSuccess(`volume deleted`))
      }
    })
  },

  listSnapshots: ({
    cluster,
    deployment,
    volume,
  }) => (dispatch, getState) => taekionApiWrapper({
    name: 'list snapshots',
    dispatch,
    apiHandler: () => api.loaderSideEffect({
      dispatch,
      loader: () => loaders.listSnapshots({cluster, deployment, volume}),
      prefix,
      name: 'listSnapshots',
      dataAction: actions.setSnapshots,
      snackbarError: false,
      returnError: true,
    })
  }),
  
  createSnapshot: ({
    cluster,
    deployment,
    volume,
    payload,
  }) => async (dispatch, getState) => {
    await taekionApiWrapper({
      name: 'create snapshot',
      globalLoading: true,
      dispatch,
      apiHandler: async () => {
        await api.loaderSideEffect({
          dispatch,
          loader: () => loaders.createSnapshot({cluster, deployment, volume, payload}),
          prefix,
          name: 'createSnapshot',
          returnError: true,
        })
        await dispatch(actions.listSnapshots({
          cluster,
          deployment,
          volume,
        }))
        dispatch(snackbarActions.setSuccess(`snapshot added`))
        dispatch(actions.setAddSnapshotWindowOpen(false))
      }
    })

  },

  deleteSnapshot: ({
    cluster,
    deployment,
    volume,
    snapshotName,
  }) => async (dispatch, getState) => {
    const params = selectors.router.params(getState())
    
    await taekionApiWrapper({
      name: 'delete snapshot',
      globalLoading: true,
      dispatch,
      apiHandler: async () => {
        await api.loaderSideEffect({
          dispatch,
          loader: () => loaders.deleteSnapshot({cluster, deployment, volume, snapshotName}),
          prefix,
          name: 'deleteSnapshot',
          returnError: true,
        })
        await dispatch(actions.listSnapshots({
          cluster,
          deployment,
          volume: params.volume,
        }))
        dispatch(snackbarActions.setSuccess(`snapshot deleted`))
      }
    })
  },

  explorerListDirectory: ({
    cluster,
    deployment,
    volume,
    inode,
  }) => async (dispatch, getState) => {

    await taekionApiWrapper({
      name: 'explorer list directory',
      globalLoading: false,
      dispatch,
      apiHandler: async () => {
        dispatch(actions.setExplorerNodeLoading({
          id: inode,
          value: true,
        }))
        const data = await api.loaderSideEffect({
          dispatch,
          loader: () => loaders.explorerListDirectory({cluster, deployment, volume, inode}),
          prefix,
          name: 'explorerListDirectory',
          returnError: true,
        })
        dispatch(actions.setExplorerDirectory({
          id: inode,
          data,
        }))
        dispatch(actions.setExplorerNodeLoading({
          id: inode,
          value: false,
        }))
      }
    })
  },

}

const reducer = CreateReducer({
  initialState,
  reducers,
  prefix,
})

const actions = CreateActions({
  reducers,
  sideEffects,
  prefix,
})

export {
  actions,
  reducer,
}

export default actions
