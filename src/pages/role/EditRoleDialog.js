import React from 'react'
import { withStyles } from '@material-ui/core/styles'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'

class EditRoleDialog extends React.Component {
  render() {
    const {
      open, onCancel, onConfirm,
    } = this.props

    return (
      <Dialog
        open={open}
        onClose={onCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Edit Role</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You may only edit the role, not the name.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>
            Cancel
          </Button>
          <Button _ci="confirm" onClick={onConfirm} variant="contained" color="secondary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default withStyles()(EditRoleDialog)
