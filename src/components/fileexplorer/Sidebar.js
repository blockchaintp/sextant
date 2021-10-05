/* eslint-disable no-shadow */
import React, { useMemo } from 'react'
import withStyles from '@mui/styles/withStyles';
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FolderTree from './FolderTree'

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    height: '100%',
  },
  volumeSelect: {
    flexGrow: 0,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  volumeSelectTitle: {
    paddingLeft: theme.spacing(1),
    width: '100px',
    '& span': {
      fontSize: '0.75em',
      color: '#666',
    },
  },
  folders: {
    flexGrow: 1,
    overflowY: 'auto',
    width: '100%',
    borderTop: '1px solid #ccc',
    marginTop: theme.spacing(1),
  },
  formControl: {
    padding: theme.spacing(1),
    width: '100%',
  },
  volumeSelectControl: {
    fontSize: '0.75em',
  },
})

const ExplorerSidebar = ({
  classes,
  explorer,
}) => {
  const {
    volume,
    volumes,
    snapshot,
    snapshots,
    onChangeVolume,
    onChangeSnapshot,
  } = explorer

  const changeVolumeSelect = useMemo(() => (volume ? (
    <div className={classes.volumeSelect}>
      <div className={classes.volumeSelectTitle}>
        <Typography variant="caption">volume:</Typography>
      </div>
      <FormControl className={classes.formControl}>
        <Select
          className={classes.volumeSelectControl}
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
    </div>
  ) : null), [
    classes,
    volume,
    volumes,
  ])

  const changeSnapshotSelect = useMemo(() => {
    if (!snapshots || snapshots.length <= 0) return null
    return (
      <div className={classes.volumeSelect}>
        <div className={classes.volumeSelectTitle}>
          <Typography variant="caption">snapshot:</Typography>
        </div>
        <FormControl className={classes.formControl}>
          <Select
            className={classes.volumeSelectControl}
            value={snapshot ? snapshot.block : 'head'}
            onChange={(ev) => onChangeSnapshot(ev.target.value)}
          >
            <MenuItem
              value="head"
            >
              latest
            </MenuItem>
            {
              snapshots
                .map((s, i) => (
                  <MenuItem
                    key={i}
                    value={s.block}
                  >
                    { s.name }
                  </MenuItem>
                ))
            }
          </Select>
        </FormControl>
      </div>
    )
  }, [
    classes,
    snapshots,
    snapshot,
  ])

  return (
    <div className={classes.root}>
      { changeVolumeSelect }
      { changeSnapshotSelect }
      <div className={classes.folders}>
        <FolderTree
          explorer={explorer}
        />
      </div>
    </div>
  )
}

export default withStyles(styles)(ExplorerSidebar)
