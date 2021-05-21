/* eslint-disable no-shadow */
import React, { useMemo, useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import SimpleTableHeader from 'components/table/SimpleTableHeader'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import selectors from 'store/selectors'
import taekionActions from 'store/modules/taekion'
import routerActions from 'store/modules/router'
import useFileExplorer from 'hooks/useFileExplorer'

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

  const {
    volume,
    volumes,
    onChangeVolume,
  } = useFileExplorer()

  const changeVolumeSelect = useMemo(() => {
    return volume ? (
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="name-readonly">Volume</InputLabel>
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
      <div className={ classes.sidebar }>
        <p>sidebar</p>
        <p>sidebar</p>
        <p>sidebar</p>
        <p>sidebar</p>
        <p>sidebar</p>
        <p>sidebar</p>
        <p>sidebar</p>
        <p>sidebar</p>
        <p>sidebar</p>
        <p>sidebar</p>
        <p>sidebar</p>
        <p>sidebar</p>
        <p>sidebar</p>
        <p>sidebar</p>
        <p>sidebar</p>
        <p>sidebar</p>
        <p>sidebar</p>
        <p>sidebar</p>
        <p>sidebar</p>
        <p>sidebar</p>
        <p>sidebar</p>
        <p>sidebar</p>
        <p>sidebar</p>
        <p>sidebar</p>
        <p>sidebar</p>
        <p>sidebar</p>
        <p>sidebar</p>
        <p>sidebar</p>
        <p>sidebar</p>
        <p>sidebar</p>
        <p>sidebar</p>
        <p>sidebar</p>
        <p>sidebar</p>
        <p>sidebar</p>
        <p>sidebar</p>
      </div>
      <div className={ classes.content }>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
      </div>
    </div>
  )
}


export default withStyles(styles)(TaekionExplorer)
