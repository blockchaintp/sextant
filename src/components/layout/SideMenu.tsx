import * as React from 'react'
import { styled } from '@mui/system'
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  SwipeableDrawer,
  IconButton,
} from '@mui/material'

import MenuIcon from '@mui/icons-material/Menu'

import settings from '../../settings'

const StyledIconButton = styled(IconButton)({
  marginLeft: -12,
  marginRight: 20,
})

const StyledListWrapper = styled(List)({
  width: settings.sideMenuWidth,
})

export interface SideMenuItem {
  title: string
  icon?: React.ComponentType
  handler: string | (() => void)
  params?: object;
}

export interface SideMenuProps {
  items: (SideMenuItem | '-')[]
  openPage: (handler: string, params: object) => void
}


const SideMenu: React.FC<SideMenuProps> = ({ items, openPage }) => {
  const [drawerOpen, setDrawerOpen] = React.useState(false)

  const handleOpen = () => {
    setDrawerOpen(true)
  }

  const handleClose = () => {
    setDrawerOpen(false)
  }

  const clickItem = (item: SideMenuItem) => {
    if (typeof (item.handler) === 'string') {
      openPage(item.handler, item.params || {})
      handleClose()
    } else if (typeof (item.handler) === 'function') {
      item.handler()
      handleClose()
    } else {
      throw new Error(`unknown SideMenu item handler for ${item.title}`)
    }
  }

  const getMenu = () => {
    return items.map((item: SideMenuItem, i) => {
      if (!item.title) {
        return (
          <Divider key={i} />
        )
      }

      return (
        <ListItemButton
          key={`${item.title.replace(/\s+/g, '')}`}
          onClick={() => clickItem(item)}
          id={`sideMenu_${item.title}`}
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
        </ListItemButton>
      )
    })
  }

  return (
    <div>
      <StyledIconButton
        color="inherit"
        aria-label="Menu"
        onClick={handleOpen}
        size="large"
        id="sideMenuButton"
      >
        <MenuIcon />
      </StyledIconButton>
      <SwipeableDrawer
        open={drawerOpen}
        onClose={handleClose}
        onOpen={handleOpen}
      >
        <div
          tabIndex={0}
          role="button"
          onClick={handleClose}
          onKeyDown={handleClose}
        >
          <StyledListWrapper>
            <List
              component="nav"
              id="sideMenuList"
            >
              { getMenu() }
            </List>
          </StyledListWrapper>
        </div>
      </SwipeableDrawer>
    </div>
  )
}

export default SideMenu
