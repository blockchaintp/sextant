import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Button  from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormHelperText from '@material-ui/core/FormHelperText'

import RoleUserAutoSuggest from 'containers/role/RoleUserAutoSuggest'

const styles = theme => ({
  formControl: {
    width: '100%',
    marginBottom: theme.spacing.unit,
  },
  spacer: {
    height: theme.spacing.unit * 4,
  }
})

class RoleForm extends React.Component {

  state = {
    accessLevel: 'read',
    username: '',
  }

  handleAccessLevelChange = event => {
    this.setState({
      accessLevel: event.target.value
    })
  }

  render() {
    const {
      classes,
      title,
      open,
      onCancel,
      onConfirm,
    } = this.props
    return (
      <Dialog
        open={ open }
        onClose={ onCancel }
        fullWidth
        maxWidth="sm"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Add { title }</DialogTitle>
        <DialogContent>
          <RoleUserAutoSuggest />
          <FormHelperText>Search for the user to add access control for</FormHelperText>
          <div className={ classes.spacer } />
          <FormControl className={classes.formControl}>
            <InputLabel>
              Access Level
            </InputLabel>
            <Select
              value={ this.state.accessLevel }
              onChange={ this.handleAccessLevelChange }
              displayEmpty
              name="accessLevel"
            >
              <MenuItem value="read">Read</MenuItem>
              <MenuItem value="write">Write</MenuItem>
            </Select>
            <FormHelperText>Set the level of access you want to give this user</FormHelperText>
          </FormControl>
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

