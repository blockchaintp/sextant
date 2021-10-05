import React from 'react'
import withStyles from '@mui/styles/withStyles';

import Button from '@mui/material/Button'
import SimpleTable from 'components/table/SimpleTable'
import SimpleTableHeader from 'components/table/SimpleTableHeader'
import SimpleTableActions from 'components/table/SimpleTableActions'

import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

import CodeBlock from 'components/code/CodeBlock'
import FormWrapper from 'components/form/Wrapper'

import settings from 'settings'

const AddIcon = settings.icons.add

const styles = (theme) => ({
  root: {
    padding: theme.spacing(2),
  },
})

const TABLE_FIELDS = [{
  title: 'Name',
  name: 'name',
}, {
  title: 'Fingerprint',
  name: 'fingerprint',
}]

const FORM_SCHEMA = [{
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
    } = this.props

    const onSubmitForm = (payload) => {
      onCreateKey({
        cluster,
        deployment,
        payload,
      })
    }

    const data = keys.map((key) => ({
      id: key.fingerprint,
      name: key.label,
      fingerprint: key.fingerprint,
    }))

    const headerActions = (
      <div className={classes.headerActions}>
        <div className={classes.addButton}>
          <Button
            _ci="addbutton"
            className={classes.button}
            variant="contained"
            color="secondary"
            onClick={onOpenAddKeyWindow}
          >
            Add
            <AddIcon />
          </Button>
        </div>
      </div>
    )

    // eslint-disable-next-line arrow-body-style
    const getActions = () => {
      const buttons = [/* {
        title: 'Delete',
        icon: DeleteIcon,
        handler: onDeleteItem,
      } */]

      return buttons
    }

    const hooks = {
      validate: (values) => {
        const errors = {}

        if (keys.find(({ name }) => name === values.name)) {
          errors.keys = 'You must choose a unique key name'
        }

        return errors
      },
    }

    return (
      <div>
        <SimpleTableHeader
          title="Keys"
          getActions={() => headerActions}
        />
        <SimpleTable
          pagination
          data={data}
          fields={TABLE_FIELDS}
          getActions={(item) => (
            <SimpleTableActions
              item={item}
              actions={getActions()}
            />
          )}
        />
        {
          addKeyWindowOpen && (
            <FormWrapper
              hooks={hooks}
              keys={keys}
              schema={FORM_SCHEMA}
              initialValues={FORM_INITIAL_VALUES}
              error={addKeyError}
              onSubmit={onSubmitForm}
              renderForm={({
                content,
                handleSubmit,
              }) => (
                <Dialog
                  open
                  onClose={onCloseAddKeyWindow}
                  fullWidth
                  maxWidth="md"
                  onKeyPress={(ev) => {
                    if (ev.key === 'Enter') {
                      ev.preventDefault();
                    }
                  }}
                >
                  <DialogTitle id="alert-dialog-title">Add Key</DialogTitle>
                  <DialogContent>
                    { content }
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={onCloseAddKeyWindow}>
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit} variant="contained" color="secondary" autoFocus>
                      Add
                    </Button>
                  </DialogActions>
                </Dialog>
              )}
            />
          )
        }
        {
          addKeyResult && (
            <Dialog
              open
              onClose={onCloseKeyResultWindow}
              fullWidth
              maxWidth="md"
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  ev.preventDefault();
                }
              }}
            >
              <DialogTitle id="alert-dialog-title">Save your key</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Your key has been created - please save it locally.
                </DialogContentText>
                <DialogContentText>
                  <strong>IMPORTANT:</strong>
                  this is the only time you will see this key so please keep it safe.
                </DialogContentText>
                <CodeBlock
                  code={addKeyResult.key}
                  clipboard
                  snackbarMessage={() => 'Key copied to clipboard'}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={onCloseKeyResultWindow}>
                  Close
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
