import React from 'react'

import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

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

    const clearAndClose = () => {
      onCancel()
      this.setState({ name: '' })
      this.setState({ error: true })
    }

    const confirmAndClose = () => {
      onConfirm()
      this.setState({ name: '' })
      this.setState({ error: true })
    }

    console.log('title: ', title);

    return (
      <Dialog
        open={open}
        onClose={clearAndClose}
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
          <Button onClick={clearAndClose}>
            Cancel
          </Button>
          <Button _ci="confirm" id="podDeleteConfirm" disabled={error} onClick={confirmAndClose} variant="contained" color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default DeletePodDialog
