import React from 'react'
import { withStyles } from '@material-ui/core/styles'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

const styles = () => ({
})

class DeletePodDialog extends React.Component {
  state = {
    name: '',
    error: true,
  };

  handleChange = (resourceName) => (event) => {
    const { value } = event.target
    if (value === resourceName) this.setState({ error: false })
    else this.setState({ error: true })
    this.setState({ name: value });
  }

  render() {
    const {
      open, onCancel, onConfirm, title,
    } = this.props
    const { name, error } = this.state

    return (
      <Dialog
        open={open}
        onClose={onCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Are you sure you want to delete ${title}?`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deleting this pod will remove it from the cluster.
            It may be recreated automatically if it is part of a
            StatefulSet, ReplicaSet, DaemonSet, or DaemonSet.
          </DialogContentText>
          <TextField
            helperText="Type the name of the resource you want to delete."
            error={error}
            id="standard-name"
            label="Pod Name"
            value={name}
            onChange={this.handleChange(title)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>
            Cancel
          </Button>
          <Button _ci="confirm" disabled={error} onClick={onConfirm} variant="contained" color="secondary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default withStyles(styles)(DeletePodDialog)
