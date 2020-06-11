import React from 'react'
import { withStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import SimpleTable from 'components/table/SimpleTable'
import SimpleTableHeader from 'components/table/SimpleTableHeader'
import SimpleTableActions from 'components/table/SimpleTableActions'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import CodeBlock from 'components/code/CodeBlock'
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
  title: 'Fingerprint',
  name: 'fingerprint',
}]

const FORM_SCHEMA = [ {
  id: 'name',
  title: 'Name',
  helperText: 'The name of your key',
  component: 'text',
  validate: {
    type: 'string',
    methods: [
      ['required', 'Required'],
    ],
  },
}]

const FORM_INITIAL_VALUES = {
  name: '',
}

class TaekionKeys extends React.Component {

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
      addKeyWindowOpen,
      addKeyResult,
      addKeyError,
      onOpenAddKeyWindow,
      onCloseAddKeyWindow,
      onCloseKeyResultWindow,
      onCreateKey,
      onDeleteKey,
    } = this.props

    const {
      deleteItem,
    } = this.state

    const onSubmitForm = (payload) => {
      onCreateKey({
        cluster,
        deployment,
        payload,
      })
    }

    const onConfirmDeleteItem = () => {
      this.setState({
        deleteItem: null,
      })
      onDeleteKey({
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

    const data = keys.map((key, index) => {
      return {
        id: key.id,
        name: key.name,
        fingerprint: key.fingerprint,
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
            onClick={ onOpenAddKeyWindow }
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

    return (
      <div>
        <SimpleTableHeader
          title="Keys"
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
          addKeyWindowOpen && (
            <FormWrapper
              schema={ FORM_SCHEMA }
              initialValues={ FORM_INITIAL_VALUES }
              error={ addKeyError }
              onSubmit={ onSubmitForm }
              renderForm={ ({
                content,
                handleSubmit,
              }) => {
                return (
                  <Dialog
                    open
                    onClose={ onCloseAddKeyWindow }
                    fullWidth
                    maxWidth="md"
                  >
                    <DialogTitle id="alert-dialog-title">Add Key</DialogTitle>
                    <DialogContent>
                      { content }
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={ onCloseAddKeyWindow }>
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
          addKeyResult && (
            <Dialog
              open
              onClose={ onCloseKeyResultWindow }
              fullWidth
              maxWidth="md"
            >
              <DialogTitle id="alert-dialog-title">Save your key</DialogTitle>
              <DialogContent>
                <DialogContentText>Your key has been created - please save it locally.</DialogContentText>
                <DialogContentText><strong>IMPORTANT:</strong> this is the only time you will see this key so please keep it safe.</DialogContentText>
                <CodeBlock
                  code={ addKeyResult.key }
                  clipboard={ true }
                  snackbarMessage={ () => "Key copied to clipboard" }
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={ onCloseKeyResultWindow }>
                  Close
                </Button>
              </DialogActions>
            </Dialog>
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
                <DialogContentText>Are you absolutely sure you want to delete the { deleteItem.name } key?</DialogContentText>
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

export default withStyles(styles)(TaekionKeys)