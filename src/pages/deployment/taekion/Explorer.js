/* eslint-disable no-shadow */
import React, { useCallback } from 'react'
import { withStyles, useTheme } from '@material-ui/core/styles'
import { FileIcon, defaultStyles } from 'react-file-icon'
import useFileExplorer from 'hooks/useFileExplorer'
import prettyBytes from 'pretty-bytes'
import ExplorerSidebar from 'components/fileexplorer/Sidebar'
import Button from '@material-ui/core/Button'
import SimpleTable from 'components/table/SimpleTable'
import SimpleTableHeader from 'components/table/SimpleTableHeader'
import SimpleTableActions from 'components/table/SimpleTableActions'

import FolderIcon from '@material-ui/icons/Folder'
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser'
import CloudDownloadIcon from '@material-ui/icons/CloudDownload'

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
  smalltext: {
    fontSize: '0.8em',
    color: '#999'
  },
  fileicon: {
    width: '30px',
    marginRight: theme.spacing.unit * 2,
  },
  filename: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  folderIcon: {
    '& svg': {
      width: '140px',
      height: '140px'
    }
    
  }
})

const TABLE_FIELDS = [{
  title: 'Name',
  name: 'name',
}, {
  title: 'Size',
  name: 'size',
  numeric: true,
}, {
  title: 'Created',
  name: 'created',
}, {
  title: 'Modified',
  name: 'modified',
}]

const TaekionExplorer = ({
  classes,
}) => {

  const explorer = useFileExplorer()

  const {
    inode_id,
    explorerDirectories,
  } = explorer

  const entries = explorerDirectories[inode_id] || []

  const clickEntry = (entry, download_filename) => {
    if(entry.isDirectory) {
      explorer.openFolder(entry.inodeid)
    }
    else {
      explorer.openFile(entry.inodeid, download_filename)
    }
  }

  const getActions = (item) => {
    const buttons = []
    
    if(!item.entry.isDirectory) {
      buttons.push({
        title: 'Download',
        icon: CloudDownloadIcon,
        handler: () => clickEntry(item.entry, item.entry.filename),
      })
    }

    buttons.push({
      title: 'Open',
      icon: OpenInBrowserIcon,
      handler: () => clickEntry(item.entry),
    })
    
    return buttons
  }

  const data = entries.map((entry) => {
    const ext = entry.filename.split('.').pop()
    let ret = {
      id: entry.inodeid,
      name: (
        <div className={ classes.filename }>
          <div className={ classes.fileicon }>
            {
              entry.isDirectory ? (
                <FolderIcon
                  color="primary"
                  style={{ fontSize: 34 }}
                />
              ) : (
                <FileIcon
                  extension={ ext }
                  glyphColor="#3F51B5"
                  labelColor="#3F51B5"
                  {...(defaultStyles[ext] || {})}
                />
              )
            }
            
          </div>
          <div>
            { entry.filename }
          </div>
        </div>
        
      ),
      entry,
      created: (
        <span className={ classes.smalltext }>
          { new Date(entry.inode.ctime).toLocaleString() }
        </span>
      ),
      modified: (
        <span className={ classes.smalltext }>
          { new Date(entry.inode.mtime).toLocaleString() }
        </span>
      )
    }

    if(!entry.isDirectory) {
      ret.size = (
        <span className={ classes.smalltext }>
          { prettyBytes(entry.inode.size) }
        </span>
      ) 
    }
    return ret
  })

  return (
    <div className={ classes.root }>
      <div className={ classes.sidebar }>
        <ExplorerSidebar
          explorer={ explorer }
        />
      </div>
      <div className={ classes.content }>
        <SimpleTable
          pagination
          data={data}
          fields={TABLE_FIELDS}
          getActions={(item) => (
            <SimpleTableActions
              item={item}
              actions={getActions(item)}
            />
          )}
        />
      </div>
    </div>
  )
}


export default withStyles(styles)(TaekionExplorer)
