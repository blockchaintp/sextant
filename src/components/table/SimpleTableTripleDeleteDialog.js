import React from 'react'
import withStyles from '@mui/styles/withStyles';

import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

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
          <Button
            disabled={error}
            _ci="confirm"
            id="simpleTableDeleteConfirm"
            onClick={() => {
              onConfirm()
              this.setState({ name: '' })
            }}
            variant="contained"
            color="primary"
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default withStyles(styles)(SimpleTableTripleDeleteDialog)
