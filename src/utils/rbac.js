const ROLES = {
  read: 1,
  write: 2,
}

/*

  tells you weather a user can do X to an entity

  params:

   * user
     * permission - superuser, admin or user
     * roles[] - an array of roles assigned to the user
   * action
     * resource_type
     * resource_id
     * method - read, write or create
  
   returns true or false

*/
const rbac = ({
  user,
  action,
}) => {
  if(!user) return false
  if(user.permission === 'superuser') return true

  const {
    resource_type,
    resource_id,
    method,
  } = action

  // the special case where a role won't do - admin or superusers can create new clusters
  if(resource_type === 'cluster' && method === 'create') {
    return user.permission === 'admin'
  }

  const roles = user.roles || []

  const resourceRole = roles.find(role => {
    return role.resource_type == resource_type && role.resource_id == resource_id
  })

  if(!resourceRole) return false
  return ROLES[resourceRole.permission] >= ROLES[action]
}

export default rbac