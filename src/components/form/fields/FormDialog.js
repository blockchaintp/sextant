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
  constructor(props) {
    super(props)
    this.state = {
      dialog: false,
    }
  }

  render() {
    const {
      field: {
        value,
        onChange,
        onBlur,
      },
      error,
      touched,
      item,
      disabled,
      submitForm,
    } = this.props

    const { dialog } = this.state

    console.log('Props:', this.props)

    const handleClickOpen = () => {
      this.setState({ dialog: true })
    };

    const clearAndClose = () => {
      this.setState({ dialog: false })
    }

    // const confirmAndClose = () => {
    //   this.setState({ dialog: false })
    // }

    // const inputProps = item.inputProps || {}
    const extraProps = item.extraProps || {}

    console.log('FormDialog', item)

    return (
      <>
        <Button variant="outlined" onClick={handleClickOpen}>
          { item.title || '' }
        </Button>
        <Dialog open={dialog}>
          <DialogTitle>{ item.title || '' }</DialogTitle>
          <DialogContent>
            <DialogContentText>
              { item.helperText || '' }
            </DialogContentText>
            {
              (item.options || []).map((option, i) => {
                const {
                  id, helperText, optionInputProps, title, validate,
                } = option
                console.log('option', option)
                console.log('validate', validate)
                console.log('optionInputProps', optionInputProps)
                return (
                  <TextField
                    key={i}
                    fullWidth
                    id={id}
                    name={title}
                    label={title || id}
                    helperText={helperText}
                    error={touched && Boolean(error)}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={disabled}
                    validate={validate}
                    {...optionInputProps}
                    {...extraProps}
                  />
                )
              })
            }
          </DialogContent>
          <DialogActions>
            <Button onClick={clearAndClose}>Cancel</Button>
            <Button onClick={submitForm}>Save</Button>
          </DialogActions>
        </Dialog>
      </>
    )
  }
}

export default withStyles(styles)(FormDialog)
