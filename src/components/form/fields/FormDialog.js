import * as React from 'react';
import withStyles from '@mui/styles/withStyles';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const styles = (theme) => ({
  root: {
    marginTop: theme.spacing(2),
  },
})

class FormDialog extends React.Component {
  render() {
    // const [open, setOpen] = React.useState(false);

    const {
      field: {
        name,
        value,
        onChange,
        onBlur,
      },
      error,
      touched,
      item,
      disabled,
    } = this.props

    console.log('field', item)

    const inputProps = item.inputProps || {}
    const extraProps = item.extraProps || {}

    // const handleClickOpen = () => {
    //   setOpen(true);
    // };

    // const handleClose = () => {
    //   setOpen(false);
    // };

    return (
      <div>
        <Button variant="outlined">
          Change Password
        </Button>
        <Dialog open>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To update this users password enter your new password and confirm then save.
            </DialogContentText>
            <TextField
              fullWidth
              id={name}
              name={name}
              label={item.title || item.id}
              helperText={touched && error ? error : item.helperText}
              error={touched && Boolean(error)}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              disabled={disabled}
              {...inputProps}
              {...extraProps}
            />
          </DialogContent>
          <DialogActions>
            <Button>Cancel</Button>
            <Button>Subscribe</Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default withStyles(styles)(FormDialog)
