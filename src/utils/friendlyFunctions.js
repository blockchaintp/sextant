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
      message = 'The cluster was deleted sucessfully.'
      break
    case 'deployment.create' :
      message = 'The deployment was added sucessfully.'
      break
    case 'deployment.update' :
      message = 'The deployment was updated sucessfully.'
      break
    case 'deployment.delete' :
      message = 'The deployment was deleted sucessfully.'
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
      message = 'The delete cluster task failed.'
      break
    case 'deployment.create' :
      message = 'The add deployment task failed.'
      break
    case 'deployment.update' :
      message = 'The update deployment task failed.'
      break
    case 'deployment.delete' :
      message = 'The delete deployment task failed.'
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
      name = 'update cluster'
      break
    case 'cluster.delete' :
      name = 'delete cluster'
      break
    case 'deployment.create' :
      name = 'add deployment'
      break
    case 'deployment.update' :
      name = 'update deployment'
      break
    case 'deployment.delete' :
      name = 'delete deployment'
      break
    default :
      name = action
  }
  return name
}
