// Functions that help make the UI more reflective of user action instead of code functionality

// accepts a string as an argument, matches it and returns a sucess message to be rendered as a pop-up Message
// if there is no match, the default is used.
export const friendlyMessageGenerator = (action) => {
  let message
  switch (action) {
    case 'cluster.create' :
      message = 'The cluster was added sucessfully.'
      break
    case 'cluster.update' :
      message = 'The cluster was updated sucessfully.'
      break
    case 'cluster.delete' :
      message = 'The cluster was deleted/deactivated sucessfully.'
      break
    case 'deployment.create' :
      message = 'The deployment was added sucessfully.'
      break
    case 'deployment.update' :
      message = 'The deployment was updated sucessfully.'
      break
    case 'deployment.delete' :
      message = 'The deployment was deleted/undeployed sucessfully.'
      break
    default :
      message = action
  }
  return message
}

// accepts a string as an argument, matches it and returns an error message to be rendered as a pop-up Message
// if there is no match, the default is used.
export const friendlyErrorGenerator = (action) => {
  let message
  switch (action) {
    case 'cluster.create' :
      message = 'The add cluster task failed.'
      break
    case 'cluster.update' :
      message = 'The update cluster task failed.'
      break
    case 'cluster.delete' :
      message = 'The delete/deactivate cluster task failed.'
      break
    case 'deployment.create' :
      message = 'The add deployment task failed.'
      break
    case 'deployment.update' :
      message = 'The update deployment task failed.'
      break
    case 'deployment.delete' :
      message = 'The delete/undeploy deployment task failed.'
      break
    default :
      message = action
  }
  return message
}

// accepts a string as an argument, matches it and returns an friendly version of the string to be rendered in a table
// if there is no match, the default is used.
export const friendlyNameGenerator = (action) => {
  let name
  switch (action) {
    case 'cluster.create' :
      name = 'add cluster'
      break
    case 'cluster.update' :
      name = 'reactivate cluster'
      break
    case 'cluster.delete' :
      name = 'deactivate cluster'
      break
    case 'deployment.create' :
      name = 'add deployment'
      break
    case 'deployment.update' :
      name = 'redeploy deployment'
      break
    case 'deployment.delete' :
      name = 'undeploy deployment'
      break
    default :
      name = action
  }
  return name
}

export const deploymentStatusTranslator = (status) => {
  let translation = status
  if (status === 'provisioned')
    translation = 'deployed'

  if (status === 'deleted')
    translation = 'undeployed'

  return translation
}

export const getDeploymentIcon = (status, settings) => {
  let icon = settings.icons.remove

  if (status === 'deployed') icon = settings.icons.remove

  if (status === 'undeployed') icon = settings.icons.delete

  if (status === 'error') icon = settings.icons.repeat

  return icon
}

export const getDeploymentIconTitle = (status, settings) => {
  let iconTitle = 'Remove'

  if (status === 'deployed') iconTitle = 'Undeploy'

  if (status === 'undeployed') iconTitle = 'Delete'

  if (status === 'error') iconTitle = 'Try Again'

  return iconTitle
}

export const getTaskIcon = (status, settings) => {
  let icon = settings.icons.remove

  if (status === 'deployed') icon = settings.icons.remove

  if (status === 'undeployed') icon = settings.icons.delete

  if (status === 'error') icon = settings.icons.repeat

  return icon
}

export const clusterStatusTranslator = (status) => {
  let translation = status
  if (status === 'provisioned')
    translation = 'active'

  if (status === 'deleted')
    translation = 'inactive'

  return translation
}

export const getClusterIcon = (status, settings) => {
  let icon = settings.icons.remove

  if (status === 'active') icon = settings.icons.remove

  if (status === 'inactive') icon = settings.icons.delete

  if (status === 'error') icon = settings.icons.repeat

  return icon
}

export const getClusterIconTitle = (status, settings) => {
  let iconTitle = 'Remove'

  if (status === 'active') iconTitle = 'Deactivate'

  if (status === 'inactive') iconTitle = 'Delete'

  if (status === 'error') iconTitle = 'Try Again'

  return iconTitle
}

export const getDialogDeleteText = (status) => {
  let text = {}

  if (status === 'deployed') {
    text.title = "Undeploy"
    text.subtext = 'undeploy'
  }

  if (status === 'undeployed') {
    text.title = "Delete"
    text.subtext = 'delete'
  }

  if (status === 'active') {
    text.title = "Deactivate"
    text.subtext = 'deactivate'
  }
  
  if (status === 'inactive') {
    text.title = "Delete"
    text.subtext = 'delete'
  }

  return text
}