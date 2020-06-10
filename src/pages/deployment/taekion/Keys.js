import React from 'react'
import { withStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import SimpleTable from 'components/table/SimpleTable'
import SimpleTableDeleteDialog from 'components/table/SimpleTableDeleteDialog'
import SimpleTableHeader from 'components/table/SimpleTableHeader'
import SimpleTableActions from 'components/table/SimpleTableActions'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
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

  render() {
    const {
      classes,
      keys,
      addKeyWindowOpen,
      onOpenAddKeyWindow,
      onCloseAddKeyWindow,
    } = this.props

    const error = ''
    const submitForm = (values) => {
      console.log('--------------------------------------------')
      console.dir(values)
    }

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
        title: 'Edit',
        icon: EditIcon,
        handler: (item) => onEdit(item.id),
      }, {
        title: 'Delete',
        icon: DeleteIcon,
        handler: (item) => onDelete(item.id),
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
              error={ error }
              onSubmit={ submitForm }
              renderForm={ ({
                content,
                handleSubmit,
              }) => {
                return (
                  <Dialog
                    open
                    onClose={ onCloseAddKeyWindow }
                    fullWidth
                    maxWidth="sm"
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
      </div>
    )
  }
}

export default withStyles(styles)(TaekionKeys)