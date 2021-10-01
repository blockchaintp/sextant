import React from 'react'
import PropTypes from 'prop-types'

import withStyles from '@mui/styles/withStyles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import MenuIcon from '@mui/icons-material/Menu'

import settings from 'settings'

const styles = () => ({
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  list: {
    width: settings.sideMenuWidth,
  },
})

class SideMenu extends React.Component {
  state = {
    drawerOpen: false,
  }

  handleOpen = () => {
    this.setState({ drawerOpen: true })
  }

  handleClose = () => {
    this.setState({ drawerOpen: false })
  }

  getMenu() {
    const {
      items,
    } = this.props

    return items.map((item, i) => {
      if (item === '-') {
        return (
          <Divider key={i} />
        )
      }

      return (
        <ListItem
          button
          key={i}
          onClick={() => this.clickItem(item)}
        >
          {
            item.icon && (
              <ListItemIcon>
                <item.icon />
              </ListItemIcon>
            )
          }
          <ListItemText
            primary={item.title}
          />
        </ListItem>
      )
    })
  }

  clickItem(item) {
    const {
      openPage,
    } = this.props

    if (typeof (item.handler) === 'string') {
      openPage(item.handler, item.params || {})
      this.handleClose()
    } else if (typeof (item.handler) === 'function') {
      item.handler()
      this.handleClose()
    } else {
      throw new Error(`unknown SideMenu item handler for ${item.title}`)
    }
  }

  render() {
    const { classes } = this.props
    const { drawerOpen } = this.state

    return (
      <div>
        <IconButton
          className={classes.menuButton}
          color="inherit"
          aria-label="Menu"
          onClick={this.handleOpen}
          size="large"
        >
          <MenuIcon />
        </IconButton>
        <SwipeableDrawer
          open={drawerOpen}
          onClose={this.handleClose}
          onOpen={this.handleOpen}
        >
          <div
            tabIndex={0}
            role="button"
            onClick={this.handleClose}
            onKeyDown={this.handleClose}
          >
            <div className={classes.list}>
              <List component="nav">
                { this.getMenu() }
              </List>
            </div>
          </div>
        </SwipeableDrawer>
      </div>
    );
  }
}

SideMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  openPage: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
}

export default withStyles(styles)(SideMenu)
