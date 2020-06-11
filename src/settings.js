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
import StorageIcon from '@material-ui/icons/Storage'
import ViewIcon from '@material-ui/icons/Visibility'
import KeyIcon from '@material-ui/icons/VpnKey'
import SettingsIcon from '@material-ui/icons/Settings'
import ClipboardIcon from '@material-ui/icons/FileCopy'
import RefreshIcon from '@material-ui/icons/Refresh'
import UpArrowIcon from '@material-ui/icons/KeyboardArrowUp'
import DownArrowIcon from '@material-ui/icons/KeyboardArrowDown'
import UploadIcon from '@material-ui/icons/CloudUpload'
import BuildIcon from '@material-ui/icons/Build'
import RemoveIcon from '@material-ui/icons/RemoveCircle'
import RepeatIcon from '@material-ui/icons/Repeat'
import ViewArchiveIcon from '@material-ui/icons/Inbox'
import CreateArchiveIcon from '@material-ui/icons/Archive'

import edition from './edition'

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
  remove: RemoveIcon,
  repeat: RepeatIcon,
  cluster: StorageIcon,
  deployment: DashboardIcon,
  view: ViewIcon,
  key: KeyIcon,
  settings: SettingsIcon,
  clipboard: ClipboardIcon,
  refresh: RefreshIcon,
  upArrow: UpArrowIcon,
  downArrow: DownArrowIcon,
  upload: UploadIcon,
  build: BuildIcon,
  viewArchive: ViewArchiveIcon,
  createArchive: CreateArchiveIcon,
}

const settings = {
  edition: edition,
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
        params: {
          cluster: 'all',
        },
        icon: icons.deployment,
      }]

      if (isSuperuser || isAdmin) {
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
      }, {
        title: 'Access Token',
        handler: 'accesstoken',
        icon: icons.key,
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
