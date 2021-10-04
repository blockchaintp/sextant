import React from 'react'
import withStyles from '@mui/styles/withStyles';

import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import TextEditor from './TextEditor'

const styles = (theme) => ({
  button: {
    marginRight: theme.spacing(2),
  },
  warning: {
    color: 'red',
  },
})

class EditorDialog extends React.Component {
  render() {
    const {
      cancel,
      save,
      open,
      classes,
      yamlInput,
      inputToState,
      customYaml,
    } = this.props
    return (
      <div>
        <Dialog
          open={open}
          onClose={cancel}
          fullWidth
          maxWidth="lg"
        >
          <DialogTitle>Additional YAML</DialogTitle>
          <DialogContent>
            <Typography className={classes.warning}>
              You can add custom yaml here which will be merged with Sextant&apos;s default deployment templates. Warning, this can break your deployment, use with care.
            </Typography>
            <TextEditor
              yamlInput={yamlInput}
              cancel={cancel}
              save={save}
              inputToState={inputToState}
              customYaml={customYaml}
            />
          </DialogContent>
        </Dialog>
      </div>
    )
  }
}
export default withStyles(styles)(EditorDialog)
