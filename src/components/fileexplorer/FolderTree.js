/* eslint-disable no-shadow */
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import FolderIcon from '@material-ui/icons/Folder'
import StorageIcon from '@material-ui/icons/Storage'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import CircularProgress from '@material-ui/core/CircularProgress'

const styles = theme => ({
  root: {
    width: '100%',
    fontSize: '0.7em',
  },
  rootListIten: {

  },
  nestedListItem: {
    paddingLeft: theme.spacing(4),
  },
})

const ExplorerFolderTreeItem = ({
  classes,
  explorer,
  entry,
  depth = 0,
}) => {

  const {
    inode_id,
    expanded,
    loading,
    clickFolderTree,
  } = explorer

  const selected = inode_id == entry.inodeid
  const open = expanded[entry.inodeid] ? true : false
  const isLoading = loading[entry.inodeid] ? true : false

  const onClick = (e) => {
    clickFolderTree(entry.inodeid)
  }

  const icon = open ? <ExpandLess /> : <ExpandMore />

  return (
    <>
      <ListItem selected={ selected } button onClick={ onClick } style={{ paddingLeft: depth * 24 }}>
        <ListItemIcon>
          <FolderIcon />
        </ListItemIcon>
        <ListItemText primary={ entry.filename } />
        {
          isLoading ? (
            <CircularProgress size={ 20 } />
          ) : (
            icon
          )
        }
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List dense component="div" disablePadding>
          {
            entry.children.map((child, i) => {
              return (
                <ExplorerFolderTreeItem
                  key={ i }
                  classes={ classes }
                  explorer={ explorer }
                  entry={ child }
                  depth={ depth + 1 }
                />
              )
            })
          }
        </List>
      </Collapse>
    </>
  )
}

const ExplorerFolderTree = ({
  classes,
  explorer,
}) => {

  const {
    inode_id,
    volume,
    folderTree,
    openFolder,
  } = explorer

  return (
    <List
      dense
      component="nav"
      aria-labelledby="nested-list-subheader"
      className={classes.root}
    >
      <ListItem selected={ inode_id == 'root' } button onClick={ () => openFolder('root') } className={ classes.rootListItem }>
        <ListItemIcon>
          <StorageIcon />
        </ListItemIcon>
        {
          volume && (
            <ListItemText primary={ volume.name } />
          )
        }
      </ListItem>
      <List dense component="div" disablePadding>
        {
          folderTree.map((child, i) => {
            return (
              <ExplorerFolderTreeItem
                key={ i }
                classes={ classes }
                explorer={ explorer }
                entry={ child }
                depth={ 1 }
              />
            )
          }) 
        }
      </List>
    </List>
  )
}


export default withStyles(styles)(ExplorerFolderTree)
