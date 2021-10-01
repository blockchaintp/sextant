import LoginIcon from '@mui/icons-material/ExitToApp'
import LogoutIcon from '@mui/icons-material/PowerSettingsNew'
import HomeIcon from '@mui/icons-material/Home'
import PeopleIcon from '@mui/icons-material/People'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import DashboardIcon from '@mui/icons-material/Dashboard'
import StorageIcon from '@mui/icons-material/Storage'
import ViewIcon from '@mui/icons-material/Visibility'
import KeyIcon from '@mui/icons-material/VpnKey'
import SettingsIcon from '@mui/icons-material/Settings'
import ClipboardIcon from '@mui/icons-material/FileCopy'
import RefreshIcon from '@mui/icons-material/Refresh'
import UpArrowIcon from '@mui/icons-material/KeyboardArrowUp'
import DownArrowIcon from '@mui/icons-material/KeyboardArrowDown'
import UploadIcon from '@mui/icons-material/CloudUpload'
import BuildIcon from '@mui/icons-material/Build'
import RemoveIcon from '@mui/icons-material/RemoveCircle'
import RepeatIcon from '@mui/icons-material/Repeat'
import ViewArchiveIcon from '@mui/icons-material/ViewModule'
import CreateArchiveIcon from '@mui/icons-material/AddAPhoto'
import AdministrationIcon from '@mui/icons-material/BusinessCenter'

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
  administration: AdministrationIcon,
}

const settings = {
  edition,
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
    if (loggedIn) {
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

      if (isSuperuser) {
        pages.push({
          title: 'Administration',
          handler: 'administration',
          icon: icons.administration,
        })
      }

      return pages.concat([
        '-',
        {
          title: 'Logout',
          handler: handlers.logout,
          icon: icons.logout,
        },
      ])
    }

    return [{
      title: 'Login',
      handler: 'login',
      icon: icons.login,
    }]
  },
  appbarMenu: ({
    loggedIn,
    handlers,
  }) => {
    if (loggedIn) {
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
    return [{
      title: 'Login',
      handler: 'login',
      icon: icons.login,
    }]
  },
}

export default settings
