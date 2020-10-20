/* eslint-disable no-shadow */
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import SimpleTable from 'components/table/SimpleTable'
import SimpleTableHeader from 'components/table/SimpleTableHeader'
import SimpleTableActions from 'components/table/SimpleTableActions'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import FormWrapper from 'components/form/Wrapper'

import settings from 'settings'

const AddIcon = settings.icons.add
const DeleteIcon = settings.icons.delete

const styles = (theme) => ({
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

const TABLE_FIELDS = [{
  title: 'Volume',
  name: 'volume_name',
}, {
  title: 'Name',
  name: 'name',
}]

const FORM_SCHEMA = [{
  id: 'volume',
  title: 'Volume',
  helperText: 'Choose the volume you want to take a snapshot for',
  component: 'select',
  validate: {
    type: 'string',
    methods: [
      ['required', 'Required'],
    ],
  },
}, {
  id: 'name',
  title: 'Name',
  helperText: 'The name of your snapshot (alphanumeric, no spaces or dashes)',
  component: 'text',
  validate: {
    type: 'string',
    methods: [
      ['required', 'Required'],
      ['matches', ['^[\\w]{1,128}$'], 'must be alphanumeric name, with no spaces or dashes and maximum 128 characters'],
    ],
  },
}]

const FORM_INITIAL_VALUES = {
  volume: '',
  name: '',
}

class TaekionSnapshots extends React.Component {
  state = {
    deleteItem: null,
  }

  // this for when we click the "create snapshot" button on the volumes page
  // it redirects here with ?create=yes
  // so we remove the "create" param and then trigger the add modal
  componentDidMount() {
    const {
      params,
      onChangeVolume,
      onOpenAddSnapshotWindow,
    } = this.props

    if (params.create === 'yes') {
      const newParams = { ...params }
      delete (newParams.create)
      onChangeVolume(params.volume, newParams)
      onOpenAddSnapshotWindow()
    }
  }

  render() {
    const {
      classes,
      cluster,
      deployment,
      params,
      volume,
      volumes,
      snapshots,
      addSnapshotWindowOpen,
      addSnapshotError,
      onChangeVolume,
      onOpenAddSnapshotWindow,
      onCloseAddSnapshotWindow,
      onCreateSnapshot,
      onDeleteSnapshot,
    } = this.props

    const {
      deleteItem,
    } = this.state

    const onSubmitForm = (payload) => {
      const {
        volume,
        ...data
      } = payload
      onCreateSnapshot({
        cluster,
        deployment,
        volume,
        payload: data,
      })
    }

    const onConfirmDeleteItem = () => {
      this.setState({
        deleteItem: null,
      })
      onDeleteSnapshot({
        cluster,
        deployment,
        volume: deleteItem.volume,
        snapshotName: deleteItem.name,
      })
    }

    const onDeleteItem = (item) => this.setState({
      deleteItem: item,
    })

    const onCancelDeleteItem = () => this.setState({
      deleteItem: null,
    })

    const volumesById = volumes.reduce((all, volume) => {
      all[volume.uuid] = volume
      return all
    }, {})

    const data = snapshots.map((snapshot) => {
      const volume = volumesById[snapshot.volume]
      return {
        id: `${snapshot.volume}-${snapshot.name}`,
        name: snapshot.name,
        volume: snapshot.volume,
        volume_name: volume ? volume.name : '',
      }
    })

    const volumeOptions = [{
      id: 'all',
      name: 'All',
    }].concat(volumes.map((volume) => ({
      id: volume.uuid,
      name: volume.name,
    })))

    const headerActions = (
      <div className={classes.headerActions}>
        <div className={classes.volumeSelect}>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="name-readonly">Volume</InputLabel>
            <Select
              value={volume}
              onChange={(ev) => onChangeVolume(ev.target.value, params)}
            >
              {
                volumeOptions
                  .map((volume, i) => (
                    <MenuItem
                      key={i}
                      value={volume.id}
                    >
                      { volume.name }
                    </MenuItem>
                  ))
              }
            </Select>
          </FormControl>
        </div>
        <div className={classes.addButton}>
          <Button
            _ci="addbutton"
            className={classes.button}
            variant="contained"
            color="secondary"
            onClick={onOpenAddSnapshotWindow}
          >
            Add
            <AddIcon />
          </Button>
        </div>
      </div>
    )

    const getActions = () => {
      const buttons = [{
        title: 'Delete',
        icon: DeleteIcon,
        handler: onDeleteItem,
      }]

      return buttons
    }

    const hooks = {
      validate: (values) => {
        const errors = {}
        if (values.volume === 'all') errors.volume = 'Please choose a volume'
        return errors
      },
      processItem: ({
        item,
      }) => {
        if (item.id === 'volume') {
          return {
            ...item,
            options: volumes.map((volume) => ({
              title: volume.name,
              value: volume.uuid,
            })),
          }
        }
        return item
      },
    }

    const useInitialValues = { ...FORM_INITIAL_VALUES, volume }

    return (
      <div>
        <SimpleTableHeader
          title="Snapshots"
          getActions={() => headerActions}
        />
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
        {
          addSnapshotWindowOpen && (
            <FormWrapper
              schema={FORM_SCHEMA}
              initialValues={useInitialValues}
              error={addSnapshotError}
              onSubmit={onSubmitForm}
              hooks={hooks}
              renderForm={({
                content,
                handleSubmit,
              }) => (
                <Dialog
                  open
                  onClose={onCloseAddSnapshotWindow}
                  fullWidth
                  maxWidth="lg"
                >
                  <DialogTitle id="alert-dialog-title">Create Snapshot</DialogTitle>
                  <DialogContent>
                    { content }
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={onCloseAddSnapshotWindow}>
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit} variant="contained" color="secondary" autoFocus>
                      Create
                    </Button>
                  </DialogActions>
                </Dialog>
              )}
            />
          )
        }
        {
          deleteItem && (
            <Dialog
              open
              onClose={onCancelDeleteItem}
              fullWidth
              maxWidth="sm"
            >
              <DialogTitle id="alert-dialog-title">Confirm delete</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you absolutely sure you want to delete the
                  { deleteItem.name }
                  snapshot?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={onCancelDeleteItem}>
                  Close
                </Button>
                <Button onClick={onConfirmDeleteItem} variant="contained" color="secondary" autoFocus>
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          )
        }
      </div>
    )
  }
}

export default withStyles(styles)(TaekionSnapshots)
