const ROLES = {
  read: 1,
  write: 2,
}

/*

  tells you weather a user can do X to an entity

  params:

   * userAccessSummary
     * superuser (bool) - is the user a superuser
     * admin (bool) - is the user an admin
   * role - a role the user has for the entity
   * action - what the user is trying to do

*/
const accessControl = ({
  userAccessSummary,
  role,
  action,
}) => {
  if(userAccessSummary.superuser) return true
  if(!role) return false
  return ROLES[role.permission] >= ROLES[action]
}

/*

  special case - there is not a role for 'create cluster'

  only superadmins or admins can do this

*/
const canCreateCluster = ({
  userAccessSummary,
}) => {
  return userAccessSummary.superuser || userAccessSummary.admin
}

const utils = {
  accessControl,
  canCreateCluster,
}

export default utils