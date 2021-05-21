/* eslint-disable no-shadow */
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import useFileExplorer from 'hooks/useFileExplorer'

import ExplorerSidebar from 'components/fileexplorer/Sidebar'

// TODO: upgrade material ui so we can use `makeStyles` and not have to decorate the component
const styles = theme => ({

  // adjust the global layout so we can have full height file explorer
  // even if there is not much content
  '@global': {
    '.main-layout-root': {
      height: '100%',
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    '.main-layout-appbar': {
      flexGrow: 0,
    },
    '.main-layout-box': {
      flexGrow: 1,
      height: 'calc(100% - 180px)',
      minHeight: 'calc(100% - 180px)',
      maxHeight: 'calc(100% - 180px)',
      paddingBottom: '0px',
    },
    '.main-layout-content': {
      height: '100%',
      minHeight: '100%',
    },
    '.deployment-settings-root': {
      height: '100%',
      minHeight: '100%',
    }
  },
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: '100%',
    minHeight: '100%',
  },
  sidebar: {
    width: '300px',
    borderRight: '1px solid #ccc',
    flexGrow: 0,
    height: '100%',
    minHeight: '100%',
    overflowY: 'auto',
  },
  content: {
    flexGrow: 1,
    paddingLeft: '20px',
    height: '100%',
    height: '100%',
    minHeight: '100%',
    overflowY: 'auto',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 200,
  },
})

const TaekionExplorer = ({
  classes,
}) => {

  const explorer = useFileExplorer()

  const {
    inode_id,
    explorerDirectories,
  } = explorer

  const entries = explorerDirectories[inode_id] || []

  return (
    <div className={ classes.root }>
      <div className={ classes.sidebar }>
        <ExplorerSidebar
          explorer={ explorer }
        />
      </div>
      <div className={ classes.content }>
        {
          entries.map((entry, i) => {
            return (
              <p key={i}>
                { entry.filename }
              </p>
            )
          })
        }
      </div>
    </div>
  )
}


export default withStyles(styles)(TaekionExplorer)
