import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Button  from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

const styles = theme => ({

})

class RoleForm extends React.Component {
  render() {
    const {
      open,
      onCancel,
      onConfirm,
    } = this.props
    return (
      <Dialog
        open={ open }
        onClose={ onCancel }
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Add Role</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Form here
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={ onCancel }>
            Cancel
          </Button>
          <Button onClick={ onConfirm } variant="contained" color="secondary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

RoleForm.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
}

export default withStyles(styles)(RoleForm)

