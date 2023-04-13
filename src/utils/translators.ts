import Settings from '../settings'

// Functions that help make the UI more reflective of user action instead of code functionality

// accepts a string as an argument, matches it and returns a sucess message to be rendered as a pop-up Message
// if there is no match, the default is used.
export const successMessageGenerator = (action: string) => {
  let message: string
  switch (action) {
    case 'cluster.create':
      message = 'The cluster was added successfully.'
      break
    case 'cluster.update':
      message = 'The cluster was updated successfully.'
      break
    case 'cluster.delete':
      message = 'The cluster was deleted/deactivated successfully.'
      break
    case 'deployment.create':
      message = 'The deployment was added successfully.'
      break
    case 'deployment.update':
      message = 'The deployment was updated successfully.'
      break
    case 'deployment.delete':
      message = 'The deployment was deleted/undeployed successfully.'
      break
    default:
      message = action
  }
  return message
}

// accepts a string as an argument, matches it and returns an error message to be rendered as a pop-up Message
// if there is no match, the default is used.
export const errorMessageGenerator = (action: string) => {
  let message: string
  switch (action) {
    case 'cluster.create':
      message = 'The add cluster task failed.'
      break
    case 'cluster.update':
      message = 'The update cluster task failed.'
      break
    case 'cluster.delete':
      message = 'The delete/deactivate cluster task failed.'
      break
    case 'deployment.create':
      message = 'The add deployment task failed.'
      break
    case 'deployment.update':
      message = 'The update deployment task failed.'
      break
    case 'deployment.delete':
      message = 'The delete/undeploy deployment task failed.'
      break
    default:
      message = action
  }
  return message
}

// accepts a string as an argument, matches it and returns an friendly version of the string to be rendered in a table
// if there is no match, the default is used.
export const actionNameTranslator = (action: string) => {
  let name: string
  switch (action) {
    case 'cluster.create':
      name = 'add'
      break
    case 'cluster.update':
      name = 'reactivate'
      break
    case 'cluster.delete':
      name = 'deactivate'
      break
    case 'deployment.create':
      name = 'add'
      break
    case 'deployment.update':
      name = 'redeploy'
      break
    case 'deployment.delete':
      name = 'undeploy'
      break
    default:
      name = action
  }
  return name
}

// accepts the status from the db and translates it to a more descriptive status for the UI
export const deploymentStatusTranslator = (status: string) => {
  let translation = status
  if (status === 'provisioned') { translation = 'deployed' }

  if (status === 'deleted') { translation = 'undeployed' }

  return translation
}

// gets the correct icon depending on the status of the deployment
export const getDeploymentIcon = (status: string, settings: typeof Settings) => {
  let icon = settings.icons.delete

  if (status === 'deployed') icon = settings.icons.remove

  return icon
}

// gets the correct icon hover text depending on the status of the deployment
export const getDeploymentIconTitle = (status: string) => {
  let iconTitle = 'Delete'

  if (status === 'deployed') iconTitle = 'Undeploy'

  return iconTitle
}

// gets the correct icon depending on the status of the deployment
export const getTaskIcon = (status: string, settings: typeof Settings) => {
  let icon = settings.icons.delete

  if (status === 'deployed') icon = settings.icons.remove

  return icon
}

// accepts the status from the db and translates it to a more descriptive status for the UI
export const clusterStatusTranslator = (status: string) => {
  let translation = status
  if (status === 'provisioned') { translation = 'active' }

  if (status === 'deleted') { translation = 'inactive' }

  return translation
}

// gets the correct icon depending on the status of the cluster
export const getClusterIcon = (status: string, settings: typeof Settings) => {
  let icon = settings.icons.delete

  if (status === 'active') icon = settings.icons.remove

  return icon
}

// gets the correct icon depending on the status of the cluster
export const getClusterIconTitle = (status: string) => {
  let iconTitle = 'Delete'

  if (status === 'active') iconTitle = 'Deactivate'

  return iconTitle
}

// returns an object for unique text in the delete dialog depending on the status of the resource
export const getDialogDeleteText = (status: string) => {
  const text = {
    title: 'Delete',
    subtext: 'delete',
  }

  if (status === 'deployed') {
    text.title = 'Undeploy'
    text.subtext = 'undeploy'
  }

  if (status === 'undeployed') {
    text.title = 'Delete'
    text.subtext = 'delete'
  }

  if (status === 'active') {
    text.title = 'Deactivate'
    text.subtext = 'deactivate'
  }

  if (status === 'inactive') {
    text.title = 'Delete'
    text.subtext = 'delete'
  }

  return text
}
