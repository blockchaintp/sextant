/* eslint-disable camelcase */
/* eslint-disable no-shadow */
import React, { useState, useMemo } from 'react'
import { styled, GlobalStyles } from '@mui/system';
import { FileIcon, defaultStyles } from 'react-file-icon'
import prettyBytes from 'pretty-bytes'
import ExplorerSidebar from 'components/fileexplorer/Sidebar'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import SimpleTable from 'components/table/SimpleTable'
import SimpleTableActions from 'components/table/SimpleTableActions'

import FolderIcon from '@mui/icons-material/Folder'
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import InfoIcon from '@mui/icons-material/Info'
import useFileExplorer from './hooks/useFileExplorer'

const Root = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  justifyContent: 'center',
  height: '100%',
  minHeight: '100%',
})

const Sidebar = styled('div')({
  width: '300px',
  borderRight: '1px solid #ccc',
  flexGrow: 0,
  height: '100%',
  minHeight: '100%',
  overflowY: 'auto',
})

const Content = styled('div')({
  flexGrow: 1,
  paddingLeft: '20px',
  height: '100%',
  minHeight: '100%',
  overflowY: 'auto',
})

const Smalltext = styled('div')({
  fontSize: '0.8em',
  color: '#999',
})

const FileIconWrapper = styled('div')(({ theme }) => ({
  width: '30px',
  marginRight: theme.spacing(2),
}))

const FileNameWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
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

const sortByFilename = (a, b) => {
  if (a.filename > b.filename) return 1
  if (a.filename < b.filename) return -1
  return 0
}

function TaekionExplorer() {
  const explorer = useFileExplorer()
  const [viewingEntry, setViewingEntry] = useState(null)

  const {
    inode_id,
    explorerDirectories,
  } = explorer

  const entries = explorerDirectories[inode_id] || []

  const sortedEntries = useMemo(() => {
    const folders = entries.filter((e) => (!!e.isDirectory))
    const files = entries.filter((e) => (!e.isDirectory))

    folders.sort(sortByFilename)
    files.sort(sortByFilename)

    return folders.concat(files)
  }, [
    entries,
  ])

  const clickEntry = (entry, download_filename) => {
    if (entry.isDirectory) {
      explorer.openFolder(entry.inodeid)
    } else {
      explorer.openFile(entry.inodeid, download_filename)
    }
  }

  const clickEntryTitle = (e, entry) => {
    e.preventDefault()
    e.stopPropagation()
    clickEntry(entry, entry.filename)
  }

  const getActions = (item) => {
    const buttons = []

    if (!item.entry.isDirectory) {
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

    buttons.push({
      title: 'Info',
      icon: InfoIcon,
      handler: () => setViewingEntry(item.entry),
    })

    return buttons
  }

  const data = sortedEntries.map((entry) => {
    const ext = entry.filename.split('.').pop()
    const ret = {
      id: entry.inodeid,
      name: (
        <FileNameWrapper>
          <FileIconWrapper>
            {
              entry.isDirectory ? (
                <FolderIcon
                  color="primary"
                  style={{ fontSize: 34 }}
                />
              ) : (
                <FileIcon
                  extension={ext}
                  glyphColor="#3F51B5"
                  labelColor="#3F51B5"
                  {...(defaultStyles[ext] || {})}
                />
              )
            }

          </FileIconWrapper>
          <div>
            <button type="button" onClick={(e) => clickEntryTitle(e, entry)}>
              { entry.filename }
            </button>
          </div>
        </FileNameWrapper>
      ),
      entry,
      created: (
        <Smalltext>
          { new Date(entry.inode.ctime).toLocaleString() }
        </Smalltext>
      ),
      modified: (
        <Smalltext>
          { new Date(entry.inode.mtime).toLocaleString() }
        </Smalltext>
      ),
    }

    if (!entry.isDirectory) {
      ret.size = (
        <Smalltext>
          { prettyBytes(entry.inode.size) }
        </Smalltext>
      )
    }
    return ret
  })

  const simpleTableActions = (item) => (
    <SimpleTableActions
      item={item}
      actions={getActions(item)}
    />
  )

  return (
    <>
      <GlobalStyles styles={{
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
        },
      }}
      />
      <Root>
        <Sidebar>
          <ExplorerSidebar
            explorer={explorer}
          />
        </Sidebar>
        <Content>
          <SimpleTable
            withSorting={false}
            pagination
            data={data}
            fields={TABLE_FIELDS}
            getActions={simpleTableActions}
          />
        </Content>
        {
        viewingEntry && (
          <Dialog
            open
            fullWidth
            maxWidth="md"
            onClose={() => setViewingEntry(null)}
          >
            <DialogTitle>{viewingEntry.filename}</DialogTitle>
            <DialogContent>
              <pre>{ JSON.stringify(viewingEntry, null, 4) }</pre>
            </DialogContent>
            <DialogActions>
              {
                !viewingEntry.isDirectory && (
                  <Button onClick={() => clickEntry(viewingEntry, viewingEntry.filename)}>
                    Download
                  </Button>
                )
              }
              <Button onClick={() => setViewingEntry(null)} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        )
      }
      </Root>
    </>
  )
}

export default TaekionExplorer
