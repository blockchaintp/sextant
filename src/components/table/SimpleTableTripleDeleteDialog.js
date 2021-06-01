import React from 'react'
import { withStyles } from '@material-ui/core/styles'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import { getDialogDeleteText } from '../../utils/translators'

const styles = () => ({
})

class SimpleTableTripleDeleteDialog extends React.Component {
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
      open, onCancel, onConfirm, title, resource, resourceType,
    } = this.props
    const { name, error } = this.state
    const text = resource ? getDialogDeleteText(resource.status) : ''
    const resourceName = resource ? resource.name : null

    return (
      <Dialog
        open={open}
        onClose={onCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`${text.title} ${title}`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Are you sure you want to ${text.subtext} ${title}?`}
          </DialogContentText>
          <TextField
            helperText="Type the name of the resource you want to delete."
            error={error}
            id="standard-name"
            label={`${resourceType} name`}
            value={name}
            onChange={this.handleChange(resourceName)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>
            Cancel
          </Button>
          <Button disabled={error} _ci="confirm" onClick={onConfirm} variant="contained" color="secondary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default withStyles(styles)(SimpleTableTripleDeleteDialog)
