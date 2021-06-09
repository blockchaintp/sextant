import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'

import Button from '@material-ui/core/Button'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

import TextField from '@material-ui/core/TextField'

import SimpleTable from 'components/table/SimpleTable'
import SimpleTableHeader from 'components/table/SimpleTableHeader'

import settings from 'settings'

const AddIcon = settings.icons.add
const ClipboardIcon = settings.icons.clipboard

const styles = (theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    margin: theme.spacing(2),
  },
  formTextContainer: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  smallText: {
    fontSize: '0.7em',
  },
})

class DeploymentSettingsKeys extends React.Component {
  setFormOpen(value) {
    const {
      setAddEnrolledKeyDialogOpen,
      setAddEnrolledKeyValue,
    } = this.props
    setAddEnrolledKeyDialogOpen(value)
    setAddEnrolledKeyValue('')
  }

  getAddRemoteKeyDialog() {
    const {
      classes,
      addEnrolledKeyDialogOpen,
      addEnrolledKeyValue,
      setAddEnrolledKeyValue,
    } = this.props
    return (
      <Dialog
        open={addEnrolledKeyDialogOpen}
        onClose={() => this.setFormOpen(false)}
        fullWidth
        maxWidth="sm"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Add Enrolled Key</DialogTitle>
        <DialogContent>
          <div className={classes.formTextContainer}>
            <TextField
              id="remote-key-add"
              label="Remote Key"
              style={{ margin: 8 }}
              placeholder="Paste the remote key here"
              helperText="You need to get the remote key from the cluster admin"
              fullWidth
              margin="normal"
              value={addEnrolledKeyValue}
              onChange={(e) => setAddEnrolledKeyValue(e.target.value)}
            />
          </div>

        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.setFormOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => this.submitAddForm()} variant="contained" color="secondary" autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  getKeyManagerTable() {
    const {
      classes,
      keyManagerKeys,
      snackbarMessage,
    } = this.props

    const fields = [{
      title: 'Name',
      name: 'name',
    }, {
      title: 'Public Key',
      name: 'key',
    }]

    const data = keyManagerKeys.map((entry) => ({
      id: entry.publicKey,
      publicKey: entry.publicKey,
      name: entry.name,
      key: (
        <span className={classes.smallText}>
          { entry.publicKey }
        </span>
      ),
    }))

    return (
      <div>
        <SimpleTableHeader
          title="Local Keys"
        />
        <SimpleTable
          data={data}
          fields={fields}
          getActions={(item) => (
            <div>
              <CopyToClipboard
                text={item.publicKey}
                onCopy={() => {
                  snackbarMessage('Copied to clipboard')
                }}
              >
                <Tooltip title="Copy to clipboard" placement="top">
                  <IconButton>
                    <ClipboardIcon />
                  </IconButton>
                </Tooltip>
              </CopyToClipboard>
            </div>
          )}
        />
      </div>
    )
  }

  getEnrolledKeysTable() {
    const {
      classes,
      enrolledKeys,
    } = this.props

    const fields = [{
      title: 'Public Key',
      name: 'key',
    }]

    const data = enrolledKeys.map((entry) => ({
      id: entry.publicKey,
      publicKey: entry.publicKey,
      key: (
        <span className={classes.smallText}>
          { entry.publicKey }
        </span>
      ),
    }))

    return (
      <div>
        <SimpleTableHeader
          title="Allowed Keys"
          getActions={() => (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => this.setFormOpen(true)}
            >
              Add
              <AddIcon />
            </Button>
          )}
        />
        <SimpleTable
          data={data}
          fields={fields}
        />
      </div>
    )
  }

  submitAddForm() {
    const {
      cluster,
      id,
      addEnrolledKeyValue,
      addEnrolledKey,
    } = this.props
    addEnrolledKey({
      cluster,
      id,
      publicKey: addEnrolledKeyValue,
    })
  }

  render() {
    const {
      classes,
    } = this.props

    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              { this.getKeyManagerTable() }
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              { this.getEnrolledKeysTable() }
            </Paper>
          </Grid>
        </Grid>
        { this.getAddRemoteKeyDialog() }
      </div>
    )
  }
}

DeploymentSettingsKeys.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(DeploymentSettingsKeys)
