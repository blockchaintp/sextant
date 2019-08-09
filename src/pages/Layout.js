import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

import SideMenu from 'components/layout//SideMenu'
import AppBarMenu from 'components/layout//AppBarMenu'

const styles = theme => ({
  root: {
    height: '100%'
  },
  appbar: {
    flexGrow: 1,
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  logo: {
    height: '50px',
    marginRight: '20px',
    flex: 0,
  },
  content: {
    height: 'calc(100% - 64px)'
  },
  box: {
    flex: 1,
    flexDirection: "column"
  },
  footer: {
    alignSelf: 'flex-end'
  }
})

class Layout extends React.Component {

  render() {
    const {
      classes,
      title,
      user,
      sideMenuItems,
      appBarMenuItems,
      openPage,
      children,
    } = this.props

    return (
      <div className={ classes.root }>
        <div className={ classes.appbar }>
          <AppBar position="static">
            <Toolbar>
              <SideMenu
                user={ user }
                items={ sideMenuItems }
                openPage={ openPage }
              />
              <img src="/sextant-logo-white.svg" className={ classes.logo } />
              <Typography
                variant="h6"
                color="inherit"
                className={ classes.flex }
              >
                { title }
              </Typography>
              <AppBarMenu
                user={ user }
                items={ appBarMenuItems }
                openPage={ openPage }
              />
            </Toolbar>
          </AppBar>
        </div>
        <div className={ classes.content }>
          { children }
        </div>
        <div >
          <Toolbar>
            <Typography>
              &copy; 2018-2019 <a href="https://blockchaintp.com/" target="_blank">Blockchain Technology Partners</a> All rights reserved : <a href="https://blockchaintp.com/sextant/aws-marketplace/support" target="_blank">Support page</a>
            </Typography>
          </Toolbar>
        </div>
      </div>
    )
  }
}

Layout.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  user: PropTypes.object,
  sideMenuItems: PropTypes.array.isRequired,
  appBarMenuItems: PropTypes.array.isRequired,
  openPage: PropTypes.func.isRequired,
}

export default withStyles(styles)(Layout)
