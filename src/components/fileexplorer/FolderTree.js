/* eslint-disable camelcase */
/* eslint-disable no-shadow */
import React from 'react'
import { styled } from '@mui/system'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import FolderIcon from '@mui/icons-material/Folder'
import StorageIcon from '@mui/icons-material/Storage'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import CircularProgress from '@mui/material/CircularProgress'

const StyledList = styled(List)(({
  width: '100%',
  fontSize: '0.7em',
}))

function ExplorerFolderTreeItem({
  classes,
  explorer,
  entry,
  depth = 0,
}) {
  const {
    inode_id,
    expanded,
    loading,
    clickFolderTree,
  } = explorer

  const selected = inode_id === entry.inodeid
  const open = !!expanded[entry.inodeid]
  const isLoading = !!loading[entry.inodeid]

  const onClick = () => {
    clickFolderTree(entry.inodeid)
  }

  const icon = open ? <ExpandLess /> : <ExpandMore />

  return (
    <>
      <ListItem selected={selected} button onClick={onClick} style={{ paddingLeft: depth * 24 }}>
        <ListItemIcon>
          <FolderIcon />
        </ListItemIcon>
        <ListItemText primary={entry.filename} />
        {
          isLoading ? (
            <CircularProgress size={20} />
          ) : (
            icon
          )
        }
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List dense component="div" disablePadding>
          {
            entry.children.map((child, i) => (
              <ExplorerFolderTreeItem
                key={i}
                classes={classes}
                explorer={explorer}
                entry={child}
                depth={depth + 1}
              />
            ))
          }
        </List>
      </Collapse>
    </>
  )
}

function ExplorerFolderTree({
  classes,
  explorer,
}) {
  const {
    inode_id,
    volume,
    folderTree,
    openFolder,
  } = explorer

  return (
    <StyledList
      dense
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      <ListItemButton selected={inode_id === 'root'} onClick={() => openFolder('root')}>
        <ListItemIcon>
          <StorageIcon />
        </ListItemIcon>
        {
          volume && (
            <ListItemText primary={volume.name} />
          )
        }
      </ListItemButton>
      <List dense component="div" disablePadding>
        {
          folderTree.map((child, i) => (
            <ExplorerFolderTreeItem
              key={i}
              classes={classes}
              explorer={explorer}
              entry={child}
              depth={1}
            />
          ))
        }
      </List>
    </StyledList>
  )
}

export default ExplorerFolderTree
