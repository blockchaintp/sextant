import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import Button from '@material-ui/core/Button'
import SimpleTable from 'components/table/SimpleTable'
import SimpleTableDeleteDialog from 'components/table/SimpleTableDeleteDialog'
import SimpleTableHeader from 'components/table/SimpleTableHeader'
import SimpleTableActions from 'components/table/SimpleTableActions'

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
const ViewArchiveIcon = settings.icons.viewArchive
const CreateArchiveIcon = settings.icons.createArchive

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 2,
  },
})

const TABLE_FIELDS =[{
  title: 'Name',
  name: 'name',
},{
  title: 'Compression',
  name: 'compression',
},{
  title: 'Encryption',
  name: 'encryption',
},{
  title: 'Key',
  name: 'key',
}]

const FORM_SCHEMA = [{
  id: 'name',
  title: 'Name',
  helperText: 'The name of your volume (alphanumeric, no spaces or dashes)',
  component: 'text',
  validate: {
    type: 'string',
    methods: [
      ['required', 'Required'],
      ['matches', ['^[\\w]{1,128}$'], "must be alphanumeric name, with no spaces or dashes and maximum 128 characters"]
    ],
  },
}, [{
  id: 'encryption',
  title: 'Encryption',
  helperText: 'Choose the type of encryption you want for your volume',
  component: 'select',
  options: [{
    title: 'None',
    value: 'NONE',
  },{
    title: 'AES_GCM',
    value: 'AES_GCM',
  }],
  validate: {
    type: 'string',
    methods: [
      ['required', 'Required'],
    ],
  },
}, {
  id: 'fingerprint',
  title: 'Encryption Key',
  helperText: 'Choose the key you want to use to encrypt this volume',
  component: 'select',
  validate: {
    type: 'string',
  },
}], [{
  id: 'compression',
  title: 'Compression',
  helperText: 'Choose the type of compression you want for your volume',
  component: 'select',
  options: [{
    title: 'None',
    value: 'NONE',
  },{
    title: 'LZ4',
    value: 'LZ4',
  }],
  validate: {
    type: 'string',
    methods: [
      ['required', 'Required'],
    ],
  },
}, ' ']]

const FORM_INITIAL_VALUES = {
  name: '',
  compression: 'NONE',
  encryption: 'NONE',
  fingerprint: '',
}

class TaekionVolumes extends React.Component {

  state = {
    deleteItem: null,
    editVolume: null
  }

  constructor(props) {
    super(props)
  }

  render() {
    const {
      classes,
      cluster,
      params,
      deployment,
      keys,
      volumes,
      addVolumeWindowOpen,
      addVolumeError,
      updateVolumeError,
      onOpenAddVolumeWindow,
      onCloseAddVolumeWindow,
      onCreateVolume,
      onUpdateVolume,
      onDeleteVolume,
      onViewSnapshots,
      onCreateSnapshot,
    } = this.props

    const {
      deleteItem,
      editVolume,
    } = this.state

    const onSubmitForm = (payload) => {
      onCreateVolume({
        cluster,
        deployment,
        payload,
      })
    }

    const onSubmitEditedForm = (payload) => {
      onUpdateVolume({
        cluster,
        deployment,
        volume: editVolume.id,
        payload,
      })
      this.setState({
        editVolume: null,
      })
    }

    const onConfirmDeleteItem = () => {
      this.setState({
        deleteItem: null,
      })
      onDeleteVolume({
        cluster,
        deployment,
        name: deleteItem.name,
      })
    }

    const onDeleteItem = (item) => this.setState({
      deleteItem: item,
    })

    const onCancelDeleteItem = () => this.setState({
      deleteItem: null,
    })

    const onEditVolume = (item) => this.setState({
      editVolume: item,
    })

    const onCancelEditVolume = (item) => {
      this.setState({
        editVolume: null,
      })
      onCloseAddVolumeWindow()
    }

    const data = volumes.map((volume, index) => {
      return {
        id: volume.uuid,
        name: volume.name,
        compression: volume.compression,
        encryption: volume.encryption,
        key: volume.fingerprint,
      }
    })

    const headerActions = (
      <div className={ classes.headerActions }>
        <div className={ classes.addButton }>
          <Button
            _ci='addbutton'
            className={ classes.button }
            variant= 'contained'
            color= 'secondary'
            onClick={ onOpenAddVolumeWindow }
          >
            Add
          <AddIcon />
          </Button>
        </div>
      </div>
    )

    const getActions = (item) => {
  
      const buttons = [{
        title: 'View Snapshots',
        icon: ViewArchiveIcon,
        handler: () => onViewSnapshots(item.id, params),
      },{
        title: 'Create Snapshot',
        icon: CreateArchiveIcon,
        handler: () => onCreateSnapshot(item.id, params),
      },{
        title: 'Delete',
        icon: DeleteIcon,
        handler: onDeleteItem,
      }, {
        title: 'Edit',
        icon: EditIcon,
        handler: onEditVolume,
      }]

      return buttons
    }

    const hooks = {      
      validate: (values) => {
        const errors = {}
        if(values.encryption != 'NONE' && !values.fingerprint) {
          errors.fingerprint = `You must select a key to use for encryption`
        }
        return errors
      },
      processItem: ({
        item,
        values,
      }) => {
        if(item.id == 'fingerprint') {
          return Object.assign({}, item, {
            options: keys.map(key => {
              return {
                title: key.name,
                value: key.fingerprint,
              }
            })
          })
        }
        else {
          return item
        }
      },
      hidden: ({
        item,
        values,
      }) => {        
        if(item.id == 'fingerprint') return values.encryption == 'NONE'
        return false
      },
      disabled: ({
        item,
        values,
      }) => item.id != 'name' && values.id ? true : false,
    }

    return (
      <div>
        <SimpleTableHeader
          title="Volumes"
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
          addVolumeWindowOpen && (
            <FormWrapper
              schema={ FORM_SCHEMA }
              initialValues={ FORM_INITIAL_VALUES }
              error={ addVolumeError }
              onSubmit={ onSubmitForm }
              hooks={ hooks }
              renderForm={ ({
                content,
                handleSubmit,
              }) => {
                return (
                  <Dialog
                    open
                    onClose={ onCloseAddVolumeWindow }
                    fullWidth
                    maxWidth="lg"
                  >
                    <DialogTitle id="alert-dialog-title">Add Volume</DialogTitle>
                    <DialogContent>
                      { content }
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={ onCloseAddVolumeWindow }>
                        Cancel
                      </Button>
                      <Button onClick={ handleSubmit } variant="contained" color="secondary" autoFocus>
                        Add
                      </Button>
                    </DialogActions>
                  </Dialog>
                )
              }}
            />
          )
        }
        {
          deleteItem && (
            <Dialog
              open
              onClose={ onCancelDeleteItem }
              fullWidth
              maxWidth="sm"
            >
              <DialogTitle id="alert-dialog-title">Confirm delete</DialogTitle>
              <DialogContent>
                <DialogContentText>Are you absolutely sure you want to delete the { deleteItem.name } volume?</DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={ onCancelDeleteItem }>
                  Close
                </Button>
                <Button onClick={ onConfirmDeleteItem } variant="contained" color="secondary" autoFocus>
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          )
        }
        {
          editVolume && (
            <FormWrapper
              schema={FORM_SCHEMA}
              initialValues={editVolume}
              error={updateVolumeError}
              onSubmit={onSubmitEditedForm}
              hooks={hooks}
              renderForm={({
                content,
                handleSubmit,
              }) => {
                return (
                  <Dialog
                    open
                    onClose={onCancelEditVolume}
                    fullWidth
                    maxWidth="lg"
                  >
                    <DialogTitle id="alert-dialog-title">Edit Volume</DialogTitle>
                    <DialogContent>
                      {content}
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={onCancelEditVolume}>
                        Cancel
                      </Button>
                      <Button onClick={handleSubmit} variant="contained" color="secondary" autoFocus>
                        Edit
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

export default withStyles(styles)(TaekionVolumes)