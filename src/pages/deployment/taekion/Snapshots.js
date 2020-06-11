import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import SimpleTable from 'components/table/SimpleTable'
import SimpleTableDeleteDialog from 'components/table/SimpleTableDeleteDialog'
import SimpleTableHeader from 'components/table/SimpleTableHeader'
import SimpleTableActions from 'components/table/SimpleTableActions'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
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
const EditIcon = settings.icons.edit
const DeleteIcon = settings.icons.delete

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

const TABLE_FIELDS =[{
  title: 'Volume',
  name: 'volume',
},{
  title: 'Name',
  name: 'name',
},{
  title: 'Date',
  name: 'date',
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
  id: 'snapshotName',
  title: 'Name',
  helperText: 'The name of your snapshot (alphanumeric, no spaces or dashes)',
  component: 'text',
  validate: {
    type: 'string',
    methods: [
      ['required', 'Required'],
      ['matches', ['^[\\w]{1,128}$'], "must be alphanumeric name, with no spaces or dashes and maximum 128 characters"]
    ],
  },
}]

const FORM_INITIAL_VALUES = {
  volume: '',
  snapshotName: '',
}

class TaekionSnapshots extends React.Component {

  // this for when we click the "create snapshot" button on the volumes page
  // it redirects here with ?create=yes
  // so we remove the "create" param and then trigger the add modal
  componentDidMount() {
    const {
      params,
      onChangeVolume,
      onOpenAddSnapshotWindow,
    } = this.props

    if(params.create == 'yes') {
      const newParams = Object.assign({}, params)
      delete(newParams.create)
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
    } = this.props

    const onSubmitForm = (payload) => {
      const {
        volume,
        ...data
      } = payload
      onCreateSnapshot({
        cluster,
        deployment,
        volumeName: volume,
        payload: data,
      })
    }

    const data = snapshots.map((snapshot, index) => {
      return {
        id: `${snapshot.volume}-${snapshot.name}`,
        name: snapshot.name,
        volume: snapshot.volume,
        date: new Date(snapshot.date).toLocaleString(),
      }
    })

    const volumeOptions = [{
      id: 'all',
      name: 'All',
    }].concat(volumes.map(volume => {
      return {
        id: volume.name,
        name: volume.name,
      }
    }))

    const headerActions = (
      <div className={ classes.headerActions }>
        <div className={ classes.volumeSelect }>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="name-readonly">Volume</InputLabel>
            <Select
              value={ volume }
              onChange={ (ev) => onChangeVolume(ev.target.value, params) }
            >
              {
                volumeOptions
                  .map((volume, i) => {
                    return (
                      <MenuItem
                        key={ i }
                        value={ volume.id }
                      >
                        { volume.name }
                      </MenuItem>
                    )
                  })
              }
            </Select>
          </FormControl>
        </div>
        <div className={ classes.addButton }>
          <Button
            _ci='addbutton'
            className={ classes.button }
            variant= 'contained'
            color= 'secondary'
            onClick={ onOpenAddSnapshotWindow }
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
        handler: () => {},
      }]

      return buttons
    }

    const hooks = {
      validate: (values) => {
        const errors = {}
        return errors
      },
      processItem: ({
        item,
        values,
      }) => {
        if(item.id == 'volume') {
          return Object.assign({}, item, {
            options: volumes.map(volume => {
              return {
                title: volume.name,
                value: volume.name,
              }
            })
          })
        }
        else {
          return item
        }
      },
    }

    const useInitialValues = Object.assign({}, FORM_INITIAL_VALUES, {
      volume,
    })

    return (
      <div>
        <SimpleTableHeader
          title="Snapshots"
          getActions={ () => headerActions }
        />
        <SimpleTable
          pagination
          data={ data }
          fields={ TABLE_FIELDS }
          getActions={ (item) => {
            return (
              <SimpleTableActions
                item={ item }
                actions={ getActions(item) }
              />
            )
          }}
        />
        {
          addSnapshotWindowOpen && (
            <FormWrapper
              schema={ FORM_SCHEMA }
              initialValues={ useInitialValues }
              error={ addSnapshotError }
              onSubmit={ onSubmitForm }
              hooks={ hooks }
              renderForm={ ({
                content,
                handleSubmit,
              }) => {
                return (
                  <Dialog
                    open
                    onClose={ onCloseAddSnapshotWindow }
                    fullWidth
                    maxWidth="lg"
                  >
                    <DialogTitle id="alert-dialog-title">Create Snapshot</DialogTitle>
                    <DialogContent>
                      { content }
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={ onCloseAddSnapshotWindow }>
                        Cancel
                      </Button>
                      <Button onClick={ handleSubmit } variant="contained" color="secondary" autoFocus>
                        Create
                      </Button>
                    </DialogActions>
                  </Dialog>
                )
              }}
            />
          )
        }
      </div>
    )
  }
}

export default withStyles(styles)(TaekionSnapshots)