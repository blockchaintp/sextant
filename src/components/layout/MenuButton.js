import React from 'react'
import PropTypes from 'prop-types'

import Button from '@mui/material/Button'

import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'

class MenuButton extends React.Component {
  state = {
    anchorEl: null,
    items: null,
  }

  handleMenu = (event) => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose = () => {
    this.setState({
      anchorEl: null,
      items: null,
    })
  }

  getMenu({
    open = false,
    items,
  }) {
    const menuItems = items.map((item, i) => {
      if (item === '-') {
        return (
          <Divider key={i} />
        )
      }

      return (
        <MenuItem
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
        </MenuItem>
      )
    })

    const {
      anchorEl,
    } = this.state

    return (
      <Menu
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
        { menuItems }
      </Menu>
    )
  }

  clickItem(item) {
    const {
      openPage,
    } = this.props

    if (item.items) {
      this.setState({
        items: item.items,
      })
      if (item.handler) {
        item.handler()
      }
      return
    }

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
      title,
      icon,
      buttonProps,
      disabled,
    } = this.props

    const {
      anchorEl,
    } = this.state

    const ButtonIcon = icon

    const open = Boolean(anchorEl)

    const { items } = this.state

    return (
      <div className={classes.root}>
        <Button
          onClick={this.handleMenu}
          disabled={disabled}
          {...buttonProps}
        >
          { title }
          { ButtonIcon && (
            <ButtonIcon />
          ) }
        </Button>

        {
          this.getMenu({
            open: open && !items,
            items,
          })
        }

        {
          items && open && (
            this.getMenu({
              open: true,
              items,
            })
          )
        }

      </div>
    )
  }
}

MenuButton.propTypes = {
  classes: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
}

export default MenuButton
