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

class ConfirmDeleteUserDialog extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      deleteUserName: ''
    };
  }

  getDeleteDialogContent() {

    const { classes, user } = this.props

    if(!user) return null

    return (
      <DialogContent>
        <DialogContentText>
          Are you <strong>absolutely</strong> sure you want to delete the <strong>{ user.username }</strong> user?<br />
          To confirm - please type the username of the user (<strong>{ user.username }</strong>) into the textbox below:
        </DialogContentText>
        <FormControl
          fullWidth
        >
          <InputLabel 
            htmlFor='confirm-user-name'
          >
            enter the username
          </InputLabel>
          <Input
            name='confirm-user-name'
            value={ this.state.deleteUserName }
            onChange={ (e) => this.setState({
              deleteUserName: e.target.value
            })}
          />
        </FormControl>
      </DialogContent>
    )
  }

  getDeleteButtonDisabled() {
    const { classes, user } = this.props 
    if(!user) return true
    return this.state.deleteUserName != user.username
  }

  onClose() {
    this.setState({
      deleteUserName: ''
    })
    this.props.onClose()
  }

  render() {
    const { classes, user } = this.props

    const dialogContent = this.getDeleteDialogContent()
    const deleteOkDisabled = this.getDeleteButtonDisabled()
    
    return (
      <Dialog
        open={ this.props.user ? true : false }
        onClose={ () => this.onClose() }
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-title">Delete User?</DialogTitle>
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
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

ConfirmDeleteUserDialog.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(ConfirmDeleteUserDialog)