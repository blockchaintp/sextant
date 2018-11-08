import React from 'react'

import PropTypes from 'prop-types'
import { connectStore } from 'redux-box'
import { withStyles } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'

import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MoreVert from '@material-ui/icons/MoreVert'

import settings from '../settings'
import withRouter from '../utils/withRouter'

const styles = (theme) => ({
  
})

@withRouter()
class AppBarMenu extends React.Component {
  state = {
    anchorEl: null,
  }

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose = () => {
    this.setState({ anchorEl: null })
  }

  openPage = (url) => {
    this.handleClose()
    this.props.routerPush(url)
  }

  getMenu() {
    const items = [
      <MenuItem key='clusters' onClick={ () => this.openPage('PAGE_CLUSTER_LIST') }>Clusters</MenuItem>,
    ]

    if(this.props.user.type == 'admin') {
      items.push(
        <MenuItem key='users' onClick={ () => this.openPage('PAGE_USER_LIST') }>Users</MenuItem>,
      )
    }

    items.push(
      <MenuItem 
        key='logout'
        onClick={ () => {
          this.handleClose()
          this.props.onLogout()
        }}
      >
        Logout
      </MenuItem>,
    )

    items.push(
      <MenuItem 
        key='support'
        onClick={ () => {
          window.open('https://blockchaintp.com/sextant/support')
        }}
      >
        Support
      </MenuItem>,
    )

    return items
  }

  render() {
    const { classes, user } = this.props
    const { anchorEl } = this.state
    const open = Boolean(anchorEl)

    if(!user) return null

    return (
      <div className={classes.root}>
        <IconButton
          aria-owns={open ? 'appbar-menu' : null}
          aria-haspopup="true"
          onClick={this.handleMenu}
          color="inherit"
        >
          <MoreVert />
        </IconButton>
        <Menu
          id="appbar-menu"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={open}
          onClose={this.handleClose}
        >
          { this.getMenu() }
        </Menu>
      </div>
    )
  }
}

AppBarMenu.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(AppBarMenu)