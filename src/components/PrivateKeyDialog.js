import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'

import { CopyToClipboard } from 'react-copy-to-clipboard'

const styles = theme => ({
  root: {
    marginTop: '10px',
    width: '99%'
  },
  divider: {
    marginTop: '20px',
    marginBottom: '20px',
  },
  button: {
    margin: theme.spacing.unit,
  },
  errorList: {
    color: '#f44336'
  },
  margin: {
    margin: theme.spacing.unit,
  },
  smallText: {
    fontSize: '0.7em'
  },
})

class PrivateKeyDialog extends React.Component {

  render() {

    const { 
      classes,
      value,
      open,
      onClose,
      onCopy,
    } = this.props

    return (
      <Dialog
        open={ open }
        onClose={ onClose }
        aria-labelledby="keypair-dialog-title"
        aria-describedby="keypair-dialog-description"
      >
        <DialogTitle id="add-dialog-title">New Keypair Generated</DialogTitle>
        <DialogContent>
        
          <DialogContentText>
            A new keypair has been generated and the public key has been added to the form.<br /><br />
            Click the <strong>copy</strong> button below to copy the private key to the clipboard.<br /><br />
            <strong>WARNING: </strong> this is the only time you will see this private key so keep it safe!<br /><br />
          </DialogContentText>

          <FormControl
            fullWidth
            className={ classes.margin }
          >
            <InputLabel >Private Key</InputLabel>
            <Input
              type="text"
              className={ classes.smallText }
              multiline
              readOnly
              rows={ 5 }
              value={ value || '' }
            />
          </FormControl>

          <CopyToClipboard 
            text={ value }
            onCopy={ onCopy }
          >
            <Button
              variant="contained"
              size="small"
              color="secondary"
              className={ classes.button }
            >
              Copy Private Key to Clipboard
            </Button>
          </CopyToClipboard>

        </DialogContent>
        <DialogActions>
          <Button onClick={ onClose } color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

}

PrivateKeyDialog.propTypes = {
  classes: PropTypes.object.isRequired,  
}

export default withStyles(styles)(PrivateKeyDialog)