import LoginIcon from '@material-ui/icons/ExitToApp'
import LogoutIcon from '@material-ui/icons/PowerSettingsNew'
import HomeIcon from '@material-ui/icons/Home'
import PeopleIcon from '@material-ui/icons/People'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import DashboardIcon from '@material-ui/icons/Dashboard'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'

const icons = {
  home: HomeIcon,
  users: PeopleIcon,
  user: AccountCircleIcon,
  login: LoginIcon,
  logout: LogoutIcon,
  more: MoreVertIcon,
  add: AddIcon,
  edit: EditIcon,
  delete: DeleteIcon,
  cluster: DashboardIcon,
  deployment: PlayArrowIcon,
}

const settings = {
  title: 'Sextant',
  api: '/api/v1',
  devMode: process.env.NODE_ENV === 'development',
  snackbarAutoHide: 5000,
  sideMenuWidth: 250,
  icons,
  sideMenu: ({
    loggedIn,
    isSuperuser,
    isAdmin,
    handlers,
  }) => {
    if(loggedIn) {

      const pages = [{
        title: 'Clusters',
        handler: 'clusters',
        icon: icons.cluster,
      }, {
        title: 'Deployments',
        handler: 'deployments',
        icon: icons.deployment,
      }]

      if(isSuperuser) {
        pages.push({
          title: 'Users',
          handler: 'users',
          icon: icons.users,
        })
      }

      return pages.concat([
        '-', 
        {
          title: 'Logout',
          handler: handlers.logout,
          icon: icons.logout,
        }
      ])
    }
    else {
      return [{
        title: 'Login',
        handler: 'login',
        icon: icons.login,
      }]
    }
  },
  appbarMenu: ({
    loggedIn,
    isSuperuser,
    isAdmin,
    handlers,
  }) => {
    if(loggedIn) {
      return [{
        title: 'Account Details',
        handler: 'accountdetails',
        icon: icons.user,
      }, '-', {
        title: 'Logout',
        handler: handlers.logout,
        icon: icons.logout,
      }]
    }
    else {
      return [{
        title: 'Login',
        handler: 'login',
        icon: icons.login,
      }]
    }
  },
}

export default settings