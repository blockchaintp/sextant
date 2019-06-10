import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import TextField from '@material-ui/core/TextField'

import SimpleTable from 'components/table/SimpleTable'
import SimpleTableHeader from 'components/table/SimpleTableHeader'

import settings from 'settings'

const AddIcon = settings.icons.add

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 2,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    margin: theme.spacing.unit * 2,
  },
  formTextContainer: {
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
  }
})

class DeploymentSettingsKeys extends React.Component {

  state = {
    addWindowOpen: false,
    addWindowKey: '',
  }

  setFormOpen(value) {
    this.setState({
      addWindowOpen: value,
      addWindowKey: '',
    })
  }

  submitAddForm() {
    const {
      cluster,
      id,
      createRemoteKey,
    } = this.props
    createRemoteKey({
      cluster,
      id,
      key: this.state.addWindowKey,
    })
    this.setFormOpen(false)
  }

  getAddRemoteKeyDialog() {
    const {
      classes,
    } = this.props
    return (
      <Dialog
        open={ this.state.addWindowOpen }
        onClose={ () => this.setFormOpen(false) }
        fullWidth
        maxWidth="sm"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Add Remote Key</DialogTitle>
        <DialogContent>
          <div className={ classes.formTextContainer }>
            <TextField
              id="remote-key-add"
              label="Remote Key"
              style={{ margin: 8 }}
              placeholder="Paste the remote key here"
              helperText="You need to get the remote key from the cluster admin"
              fullWidth
              margin="normal"
              value={ this.state.addWindowKey }
              onChange={ (e) => this.setState({
                addWindowKey: e.target.value,
              })}
            />
          </div>
          
        </DialogContent>
        <DialogActions>
          <Button onClick={ () => this.setFormOpen(false) }>
            Cancel
          </Button>
          <Button onClick={ () => this.submitAddForm() } variant="contained" color="secondary" autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  getKeyTable({
    title,
    keys,
    getActions,
  }) {

    const fields =[{
      title: 'Key',
      name: 'id',
    }]

    return (
      <div>
        <SimpleTableHeader
          title={ title }
          getActions={ getActions }
        />
        <SimpleTable
          data={ keys }
          fields={ fields }
        />
      </div>
    )
  }

  getAddRemoteKeyButton() {
    return (
      <Button
        variant='contained'
        color='secondary'
        onClick={ () => this.setFormOpen(true) }
      >
        Add
        <AddIcon />
      </Button>
    )
  }

  render() {
    const {
      classes,
      localValidatorKeys,
      localDamlRPCKeys,
      remoteKeys,
    } = this.props

    return (
      <div className={ classes.root }>
        <Grid container spacing={24}>
          <Grid item xs={ 4 }>
            <Paper className={ classes.paper }>
              {
                this.getKeyTable({
                  title: 'Local Validator Keys',
                  keys: localValidatorKeys,
                })
              }
            </Paper>
          </Grid>
          <Grid item xs={ 4 }>
            <Paper className={ classes.paper }>
              {
                this.getKeyTable({
                  title: 'Local RPC Keys',
                  keys: localDamlRPCKeys,
                })
              }
            </Paper>
          </Grid>
          <Grid item xs={ 4 }>
            <Paper className={ classes.paper }>
              {
                this.getKeyTable({
                  title: 'Enrolled Validator Keys',
                  keys: remoteKeys,
                  getActions: () => this.getAddRemoteKeyButton()
                })
              }
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