/* eslint-disable no-shadow */
import React, { useMemo } from 'react'
import { withStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FolderTree from './FolderTree'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    height: '100%',
  },
  volumeSelect: {
    flexGrow: 0,
    width: '100%',
  },
  folders: {
    flexGrow: 1,
    overflowY: 'auto',
    width: '100%',
  },
  formControl: {
    padding: theme.spacing(4),
    width: '100%',
  },
})

const ExplorerSidebar = ({
  classes,
  explorer,
}) => {

  const {
    volume,
    volumes,
    onChangeVolume,
  } = explorer

  const changeVolumeSelect = useMemo(() => {
    return volume ? (
      <FormControl className={classes.formControl}>
        <Select
          value={volume.uuid}
          onChange={(ev) => onChangeVolume(ev.target.value)}
        >
          {
            volumes
              .map((v, i) => (
                <MenuItem
                  key={i}
                  value={v.uuid}
                >
                  { v.name }
                </MenuItem>
              ))
          }
        </Select>
      </FormControl>
    ) : null
  }, [
    classes,
    volume,
    volumes,
  ])

  return (
    <div className={ classes.root }>
      <div className={ classes.volumeSelect }>
        { changeVolumeSelect }
      </div>
      <div className={ classes.folders }>
        <FolderTree
          explorer={ explorer }
        />
      </div>
    </div>
  )
}


export default withStyles(styles)(ExplorerSidebar)
