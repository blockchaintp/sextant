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

// TODO: upgrade material ui so we can use `makeStyles` and not have to decorate the component
const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 2,
  },
  headerActions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'right',
    alignItems: 'center',
  },
  volumeSelect: {
    marginRight: theme.spacing.unit * 2,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 200,
  },
})

const TaekionExplorer = ({
  classes,
}) => {
  const dispatch = useDispatch()
  
  const params = useSelector(selectors.router.params)
  const volumes = useSelector(selectors.taekion.volumes)
  const volume = useMemo(() => {
    let volume = volumes[0]
    if(params.volume) {
      const idVolume = volumes.find(v => v.uuid == params.volume)
      volume = idVolume || volume
    }
    return volume
  }, [
    volumes,
    params.volume,
  ])

  const onChangeVolume = useCallback((id) => {
    const newParams = Object.assign({}, params, {
      volume: id,
      inode: 'root',
    })
    dispatch(routerActions.navigateTo('deployment_settings.taekionExplorer', newParams))
  }, [
    params,
  ])

  useEffect(() => {
    if(!volume) return
    dispatch(taekionActions.explorerListDirectory({
      cluster: params.cluster,
      deployment: params.id,
      volume: volume.uuid,
      inode: params.inode,
    }))
  }, [
    volume,
    params.inode,
  ])

  const headerActions = volume ? (
    <div className={classes.headerActions}>
      <div className={classes.volumeSelect}>
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
      </div>
    </div>
  ) : null

  return (
    <div>
      <SimpleTableHeader
        title="Explorer"
        getActions={() => headerActions}
      />
    </div>
  )
}


export default withStyles(styles)(TaekionExplorer)
