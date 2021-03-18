import React from 'react'
import { withStyles } from '@material-ui/core/styles'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormHelperText from '@material-ui/core/FormHelperText'

const styles = (theme) => ({
  formControl: {
    width: '100%',
    margin: theme.spacing.unit,
  },
  spacer: {
    height: theme.spacing.unit * 4,
  },
})

class EditRoleDialog extends React.Component {
  render() {
    const {
      classes, open, onCancel, onConfirm, level, setLevel,
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
            You may only edit the role.
          </DialogContentText>
          <FormControl className={classes.formControl}>
            <InputLabel>
              Access Level
            </InputLabel>
            <Select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              displayEmpty
              name="accessLevel"
            >
              <MenuItem value="read">Read</MenuItem>
              <MenuItem value="write">Write</MenuItem>
            </Select>
            <FormHelperText>Choose the level of access you want to give this user</FormHelperText>
          </FormControl>
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

export default withStyles(styles)(EditRoleDialog)
