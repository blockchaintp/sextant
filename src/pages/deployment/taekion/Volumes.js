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
  helperText: 'The name of your volume',
  component: 'text',
  validate: {
    type: 'string',
    methods: [
      ['required', 'Required'],
    ],
  },
}, [{
  id: 'compression',
  title: 'Compression',
  helperText: 'Choose the type of compression you want for your volume',
  component: 'select',
  options: [{
    title: 'None',
    value: 'none',
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
}, ' '], [{
  id: 'encryption',
  title: 'Encryption',
  helperText: 'Choose the type of encryption you want for your volume',
  component: 'select',
  options: [{
    title: 'None',
    value: 'none',
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
    methods: [
      ['required', 'Required'],
    ],
  },
}]]

const FORM_INITIAL_VALUES = {
  name: '',
  compression: 'none',
  encryption: 'none',
}

class TaekionVolumes extends React.Component {

  state = {
    deleteItem: null,
  }

  constructor(props) {
    super(props)
  }

  render() {
    const {
      classes,
      cluster,
      deployment,
      keys,
      volumes,
      addVolumeWindowOpen,
      addVolumeError,
      onOpenAddVolumeWindow,
      onCloseAddVolumeWindow,
      onCreateVolume,
      onDeleteVolume,
    } = this.props

    const {
      deleteItem,
    } = this.state

    const onSubmitForm = (payload) => {
      onCreateVolume({
        cluster,
        deployment,
        payload,
      })
    }

    const onConfirmDeleteItem = () => {
      this.setState({
        deleteItem: null,
      })
      onDeleteVolume({
        cluster,
        deployment,
        id: deleteItem.id,
      })
    }

    const onDeleteItem = (item) => this.setState({
      deleteItem: item,
    })

    const onCancelDeleteItem = () => this.setState({
      deleteItem: null,
    })

    const data = volumes.map((volume, index) => {
      return {
        id: volume.name,
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
        if(values.encryption != 'none' && !values.fingerprint) {
          errors.fingerprint = `You must select a key to use for encryption`
        }
        return errors
      },
      hidden: ({
        item,
        values,
      }) => {
        if(item.id == 'fingerprint') return values.encryption == 'none'
        return false
      }
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
      </div>
    )
  }
}

export default withStyles(styles)(TaekionVolumes)