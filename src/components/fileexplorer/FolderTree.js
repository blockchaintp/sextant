/* eslint-disable no-shadow */
import React, { useMemo } from 'react'
import { withStyles } from '@material-ui/core/styles'
import ListSubheader from '@material-ui/core/ListSubheader'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import FolderIcon from '@material-ui/icons/Folder'
import DraftsIcon from '@material-ui/icons/Drafts'
import SendIcon from '@material-ui/icons/Send'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import CircularProgress from '@material-ui/core/CircularProgress'
import StarBorder from '@material-ui/icons/StarBorder'


const styles = theme => ({
  root: {
    width: '100%',
    fontSize: '0.7em',
  },
  rootListIten: {

  },
  nestedListItem: {
    paddingLeft: theme.spacing.unit * 4,
  },
})

const ExplorerFolderTreeItem = ({
  classes,
  explorer,
  entry,
  isRoot = false,
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
  const itemClassname = isRoot ? classes.rootListItem : classes.nestedListItem

  const onClick = (e) => {
    clickFolderTree(entry.inodeid)
  }

  const icon = open ? <ExpandLess /> : <ExpandMore />

  return (
    <>
      <ListItem selected={ selected } button onClick={ onClick } className={ itemClassname }>
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
    volume,
    volumes,
    folderTree,
    expanded,
    loading,
    onChangeVolume,
    onSetExpanded,
  } = explorer

  const handleClick = () => {}

  const open = true

  console.dir(folderTree)

  return (
    <List
      dense
      component="nav"
      aria-labelledby="nested-list-subheader"
      className={classes.root}
    >
      {
        folderTree.map((child, i) => {
          return (
            <ExplorerFolderTreeItem
              isRoot
              key={ i }
              classes={ classes }
              explorer={ explorer }
              entry={ child }
            />
          )
        }) 
      }
    </List>
  )
}


export default withStyles(styles)(ExplorerFolderTree)
