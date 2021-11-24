import React from 'react'
import withStyles from '@mui/styles/withStyles';

import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'

const styles = (theme) => ({
  formControl: {
    width: '100%',
    margin: theme.spacing(1),
  },
  spacer: {
    height: theme.spacing(4),
  },
})

class EditRoleDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      role: props.level,
    }
    this.setLevel = this.setRole.bind(this)
  }

  setRole(role) {
    this.setState({ role })
    const { setLevel } = this.props
    setLevel(role)
  }

  render() {
    const {
      classes, open, onCancel, onConfirm,
    } = this.props
    const { role } = this.state
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
              value={role}
              onChange={(e) => this.setRole(e.target.value)}
              displayEmpty
              label="Access Level"
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
          <Button _ci="confirm" onClick={onConfirm} variant="contained" color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default withStyles(styles)(EditRoleDialog)
