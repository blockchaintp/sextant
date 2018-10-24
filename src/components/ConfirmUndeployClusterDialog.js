import React from 'react'
import PropTypes from 'prop-types'
import { connectStore } from 'redux-box'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import { lighten } from '@material-ui/core/styles/colorManipulator'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'

import Button from '@material-ui/core/Button'

const styles = theme => {
  return {

  }
}

class ConfirmUndeployClusterDialog extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      undeployClusterName: ''
    };
  }

  getUndeployDialogContent() {

    const { classes, cluster } = this.props

    if(!cluster) return null

    return (
      <DialogContent>
        <DialogContentText>
          Are you <strong>absolutely</strong> sure you want to remove sawtooth from the <strong>{ cluster.settings.name }</strong> cluster?<br />
          To confirm - please type the name of the cluster (<strong>{ cluster.settings.name }</strong>) into the textbox below:
        </DialogContentText>
        <FormControl
          fullWidth
        >
          <InputLabel 
            htmlFor='confirm-cluster-name'
          >
            enter the cluster name
          </InputLabel>
          <Input
            name='confirm-cluster-name'
            value={ this.state.undeployClusterName }
            onChange={ (e) => this.setState({
              undeployClusterName: e.target.value
            })}
          />
        </FormControl>
      </DialogContent>
    )
  }

  getUndeployButtonDisabled() {
    const { classes, cluster } = this.props 
    if(!cluster) return true
    return this.state.undeployClusterName != cluster.settings.name
  }

  onClose() {
    this.setState({
      undeployClusterName: ''
    })
    this.props.onClose()
  }

  render() {
    const { classes, cluster } = this.props

    const dialogContent = this.getUndeployDialogContent()
    const deleteOkDisabled = this.getUndeployButtonDisabled()
    
    return (
      <Dialog
        open={ this.props.cluster ? true : false }
        onClose={ () => this.onClose() }
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-title">Remove Sawtooth from cluster?</DialogTitle>
          { dialogContent }
        <DialogActions>
          <Button 
            color="primary"
            onClick={ () => this.onClose() }
          >
            Cancel
          </Button>
          <Button 
            color="primary" 
            variant="contained"
            autoFocus
            disabled={ deleteOkDisabled }
            onClick={ () => this.props.onConfirm() }
          >
            Undeploy
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

ConfirmUndeployClusterDialog.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(ConfirmUndeployClusterDialog)