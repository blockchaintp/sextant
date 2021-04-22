// if we are running under a sub-path then prepend that path
// to all the frontend routes
const processRoutePath = (path) => {
  // if we are not running under a sub-path then just return the route
  if (!window.SEXTANT_ROOT_PATH || window.SEXTANT_ROOT_PATH === '/') return path
  // prepend our sub-path to the route
  return window.SEXTANT_ROOT_PATH + path
}

export default processRoutePath
