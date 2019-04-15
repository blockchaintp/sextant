import LoginIcon from '@material-ui/icons/ExitToApp'
import LogoutIcon from '@material-ui/icons/PowerSettingsNew'
import HomeIcon from '@material-ui/icons/Home'
import ContentIcon from '@material-ui/icons/Inbox'

const settings = {
  title: 'Sextant',
  api: '/api/v1',
  devMode: process.env.NODE_ENV === 'development',
  snackbarAutoHide: 5000,
  authRedirects: {
    // where to redirect if a route requires a user
    // and there is none
    user: 'login',
    // where to redirect if a route requires a guest
    // and there is a user
    guest: 'home',
  },
  sideMenuWidth: 250,
  sideMenu: ({
    loggedIn,
    handlers,
  }) => {
    if(loggedIn) {
      return [{
        title: 'Home',
        handler: 'home',
        icon: HomeIcon,
      }, '-', {
        title: 'Logout',
        handler: handlers.logout,
        icon: LogoutIcon,
      }]
    }
    else {
      return [{
        title: 'Login',
        handler: 'login',
        icon: LoginIcon,
      }]
    }
  },
  appbarMenu: ({
    loggedIn,
    handlers,
  }) => {
    if(loggedIn) {
      return [{
        title: 'Logout',
        handler: handlers.logout,
        icon: LogoutIcon,
      }]
    }
    else {
      return [{
        title: 'Login',
        handler: 'login',
        icon: LoginIcon,
      }]
    }
  },
}

export default settings