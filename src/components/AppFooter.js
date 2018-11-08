import React from 'react'

import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

import settings from '../settings'

import SideMenu from './SideMenu'
import AppBarMenu from './AppBarMenu'

const styles = {
  root: {
    top: 'auto',
    bottom: 0,
  },
  flex: {
    flex: 1,
  },
  textContainer: {
    display: 'flex',
  },
  textLeft: {
    flex: 1,
  },
  textRight: {
    flex: 0,
  }
}

class AppFooterComponent extends React.Component {
  render() {
    const { 
      classes,
      user,
      onLogout,
    } = this.props

    return (
      <AppBar position="fixed" color="default" className={classes.root}>
        <Toolbar>
          <Typography>
            &copy; 2018 <a href="https://blockchaintp.com/" target="_blank">Blockchain Technology Partners</a> : <a href="https://blockchaintp.com/sextant/support" target="_blank">Support page</a>
          </Typography>
        </Toolbar>
      </AppBar>
    )
  }
}

AppFooterComponent.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(AppFooterComponent)