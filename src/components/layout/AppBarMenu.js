import React from 'react'
import PropTypes from 'prop-types'

import withStyles from '@mui/styles/withStyles';
import Button from '@mui/material/Button'

import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import UserAvatar from 'components/user/Avatar'
import settings from 'settings'

const MoreIcon = settings.icons.more

const styles = (theme) => ({
  avatarWrapper: {
    display: 'flex',
  },
  avatarName: {
    flex: 1,
    margin: theme.spacing(1),
  },
})

class AppBarMenu extends React.Component {
  state = {
    anchorEl: null,
  }

  handleMenu = (event) => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose = () => {
    this.setState({ anchorEl: null })
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
        <MenuItem
          key={i}
          onClick={() => this.clickItem(item)}
          id={`appBarMenu_${item.title}`}
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
        </MenuItem>
      )
    })
  }

  clickItem(item) {
    const {
      openPage,
    } = this.props

    if (typeof (item.handler) === 'string') {
      openPage(item.handler)
      this.handleClose()
    } else if (typeof (item.handler) === 'function') {
      item.handler()
      this.handleClose()
    } else {
      throw new Error(`unknown AppBarMenu item handler for ${item.title}`)
    }
  }

  render() {
    const {
      classes,
      user,
    } = this.props

    const {
      anchorEl,
    } = this.state

    const open = Boolean(anchorEl)

    return (
      <div className={classes.root}>
        <Button
          aria-owns={open ? 'appbar-menu' : null}
          aria-haspopup="true"
          onClick={this.handleMenu}
          color="inherit"
          id="avatar"
        >
          {
            user ? (
              <UserAvatar
                _ci="avatar"
                user={user}
              />
            ) : (
              <MoreIcon />
            )
          }
        </Button>
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
          <MenuItem key="placeholder" style={{ display: 'none' }} />
          { this.getMenu() }
        </Menu>
      </div>
    )
  }
}

AppBarMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object,
  openPage: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
}

AppBarMenu.defaultProps = {
  user: PropTypes.object,
}

export default withStyles(styles)(AppBarMenu)
