import selectors from 'store/selectors'
import userActions from 'store/modules/user'
import clusterActions from 'store/modules/cluster'
import deploymentActions from 'store/modules/deployment'
import deploymentSettingsActions from 'store/modules/deploymentSettings'
import networkActions from 'store/modules/network'
import customizationActions from 'store/modules/customization'
import taekionActions from 'store/modules/taekion'

const authHandlers = {
  guest: (state) => selectors.auth.loggedIn(state) ?
    'home' :
    null,
  user: (state) => selectors.auth.loggedIn(state) ?
    null :
    'login',
  superuser: (state) => selectors.auth.isSuperuser(state) ?
    null :
    'home',
  superuserOrAdmin: (state) => selectors.auth.isSuperuser(state) || selectors.auth.isAdmin(state) ?
    null :
    'home'
}

const routes = [
  {
    name: 'login',
    path: '/login',
    authorize: authHandlers.guest,
  },
  {
    name: 'logout',
    path: '/logout',
  },
  {
    name: 'create-initial-user',
    path: '/create-initial-user',
    authorize: authHandlers.guest,
    redirect: (state) => {
      const hasInitialUser = selectors.user.hasInitialUser(state)

      // if we do have an initial user - we redirect to login
      // if the user is already logged in, the authorize
      // handler on the login route will get the to home
      return hasInitialUser ?
        'login' :
        null
    },
  },
  {
    name: 'home',
    path: '/',
    authorize: authHandlers.user,
    redirect: 'clusters',
  },
  {
    name: 'notfound',
    path: '/notfound',
  },
  {
    name: 'users',
    path: '/users',
    authorize: authHandlers.superuserOrAdmin,
    trigger: {
      activate: (store) => store.dispatch(userActions.list()),
    },
  },
  {
    name: 'user',
    path: '/user/:id',
    authorize: authHandlers.superuserOrAdmin,
    trigger: {
      activate: (store, params) => {
        if(params.id == 'new') return
        store.dispatch(userActions.get(params.id))
      },
    },
  },
  {
    name: 'accountdetails',
    path: '/accountdetails',
    authorize: authHandlers.user,
    trigger: {
      deactivate: (store) => {
        store.dispatch(networkActions.clearError('user.form'))
      },
    },
  },
  {
    name: 'accesstoken',
    path: '/accesstoken',
    authorize: authHandlers.user,
    trigger: {
      activate: (store, params) => {
        store.dispatch(userActions.getAccessToken())
      },
    },
  },
  {
    name: 'clusters',
    path: '/clusters',
    authorize: authHandlers.user,
    trigger: {
      activate: (store) => store.dispatch(clusterActions.startClusterLoop()),
      deactivate: (store) => store.dispatch(clusterActions.stopClusterLoop()),
    },
  },
  {
    name: 'cluster',
    path: '/cluster/:id',
    authorize: authHandlers.user,
    trigger: {
      activate: (store, params) => {
        store.dispatch(clusterActions.listRoles(params.id))
        if(params.id == 'new') return
        store.dispatch(networkActions.startLoading('cluster.get'))
        store.dispatch(clusterActions.get(params.id))
        store.dispatch(clusterActions.listTasks(params.id))
      },
    },
  },
  {
    name: 'cluster_status',
    path: '/clusters/:cluster/status',
    authorize: authHandlers.user,
    trigger: {
      activate: (store, params) => {
        store.dispatch(networkActions.startLoading('cluster.get'))
        store.dispatch(clusterActions.get(params.cluster))
        store.dispatch(clusterActions.listTasks(params.cluster))
        store.dispatch(clusterActions.getSummary(params.cluster))
        store.dispatch(clusterActions.startResourcesLoop(params.cluster))
        store.dispatch(deploymentActions.list({
          cluster: params.cluster
        }))
      },
      deactivate: (store) => store.dispatch(clusterActions.stopResourcesLoop()),
    },
  },
  {
    name: 'deployments',
    path: '/clusters/:cluster/deployments',
    authorize: authHandlers.user,
    trigger: {
      activate: (store, params) => {
        store.dispatch(clusterActions.list({
          noDeleted: true,
        }))
        store.dispatch(deploymentActions.startDeploymentLoop({
          cluster: params.cluster,
        }))
      },
      deactivate: (store) => store.dispatch(deploymentActions.stopDeploymentLoop()),
    },
  },
  {
    name: 'deployment',
    path: '/clusters/:cluster/deployment/:id',
    authorize: authHandlers.user,
    trigger: {
      activate: (store, params) => {
        store.dispatch(deploymentActions.listRoles(params.cluster, params.id))
        if(params.id == 'new') return
        store.dispatch(networkActions.startLoading('deployment.get'))
        store.dispatch(deploymentActions.get(params.cluster, params.id))
        store.dispatch(deploymentActions.listTasks(params.cluster, params.id))
      },
      deactivate: (store) => {
        store.dispatch(networkActions.clearError('deployment.form'))
        store.dispatch(customizationActions.clearYamlInput())
      }
    },
  },
  {
    name: 'deployment_status',
    path: '/clusters/:cluster/deployment/:id/status',
    authorize: authHandlers.user,
    trigger: {
      activate: (store, params) => {
        store.dispatch(networkActions.startLoading('deployment.get'))
        store.dispatch(deploymentActions.get(params.cluster, params.id))
        store.dispatch(deploymentActions.listTasks(params.cluster, params.id))
        store.dispatch(deploymentActions.getSummary(params.cluster, params.id))
        store.dispatch(deploymentActions.startResourcesLoop({
          cluster: params.cluster,
          deployment: params.id,
        }))
      },
      deactivate: (store) => {
        store.dispatch(deploymentActions.stopResourcesLoop())
        store.dispatch(customizationActions.clearYamlInput(0))
      }
    },
  },
  {
    name: 'deployment_settings',
    path: '/clusters/:cluster/deployment/:id/settings',
    authorize: authHandlers.user,
    trigger: {
      activate: (store, params) => {
        store.dispatch(deploymentActions.get(params.cluster, params.id))
      },
    },
    children: [{
      name: 'keys',
      path: '/keys',
      trigger: {
        activate: (store, params) => {
          store.dispatch(deploymentSettingsActions.listKeyManagerKeys({
            cluster: params.cluster,
            id: params.id
          }))
        },
      },
    }, {
      name: 'damlParties',
      path: '/damlParties',
      trigger: {
        activate: (store, params) => {
          store.dispatch(deploymentSettingsActions.listKeyManagerKeys({
            cluster: params.cluster,
            id: params.id
          }))
          store.dispatch(deploymentSettingsActions.listParticipants({
            cluster: params.cluster,
            id: params.id
          }))
        },
        deactivate: (store, params) => {

        }
      },
    }, {
      name: 'damlArchives',
      path: '/damlArchives',
      trigger: {
        activate: (store, params) => {
          store.dispatch(deploymentSettingsActions.listArchives({
            cluster: params.cluster,
            id: params.id
          }))
        },
        deactivate: (store, params) => {

        }
      },
    }, {
      name: 'damlTimeService',
      path: '/damlTimeService',
      trigger: {
        activate: (store, params) => {
          store.dispatch(deploymentSettingsActions.listTimeServiceInfo({
            cluster: params.cluster,
            id: params.id
          }))
        },
        deactivate: (store, params) => {

        }
      },
    }, {
      name: 'taekionKeys',
      path: '/taekion/keys',
      trigger: {
        activate: (store, params) => {
          store.dispatch(taekionActions.listKeys({
            cluster: params.cluster,
            deployment: params.id
          }))
        },
      },
    }, {
      name: 'taekionVolumes',
      path: '/taekion/volumes',
      trigger: {
        activate: (store, params) => {
          store.dispatch(taekionActions.listKeys({
            cluster: params.cluster,
            deployment: params.id
          }))
          store.dispatch(taekionActions.listVolumes({
            cluster: params.cluster,
            deployment: params.id
          }))
        },
      },
    }, {
      name: 'taekionSnapshots',
      path: '/taekion/snapshots',
      trigger: {
        activate: (store, params) => {
          // TBC how to get the volume name here
        },
      },
    }]

  },
]


export default routes
