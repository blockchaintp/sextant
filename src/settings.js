import LoginIcon from '@material-ui/icons/ExitToApp'
import LogoutIcon from '@material-ui/icons/PowerSettingsNew'
import HomeIcon from '@material-ui/icons/Home'
import PeopleIcon from '@material-ui/icons/People'

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
    isSuperuser,
    isAdmin,
    handlers,
  }) => {
    if(loggedIn) {

      const pages = [{
        title: 'Home',
        handler: 'home',
        icon: HomeIcon,
      }]

      if(isSuperuser) {
        pages.push({
          title: 'Users',
          handler: 'users',
          icon: PeopleIcon,
        })
      }

      return pages.concat([
        '-', 
        {
          title: 'Logout',
          handler: handlers.logout,
          icon: LogoutIcon,
        }
      ])
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
    isSuperuser,
    isAdmin,
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