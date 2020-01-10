import React from 'react'
import { withStyles } from '@material-ui/core/styles'

import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'


import TextEditor from './TextEditor'

const styles = theme => {
  return {
    button: {
      marginRight: theme.spacing.unit * 2,
    },
    warning: {
      color: "red"
    },
  }
}

class EditorDialog extends React.Component {

  render() {
    const {
      cancel,
      save,
      open,
      classes,
      yamlInput,
      inputToState,
      customYaml
    } = this.props
    return (
      <div>
        <Dialog
          open={open}
          onClose={cancel}
          fullWidth={true}
          maxWidth='lg'
        >
          <DialogTitle >Additional YAML</DialogTitle>
          <DialogContent>
            <Typography className={classes.warning}>
              I'm a message about how advanced and scary this option is! I also have some vague instructions about how to use the editor.
            </Typography>
            <TextEditor
              yamlInput={yamlInput}
              cancel={cancel}
              save={save}
              inputToState={inputToState}
              customYaml={customYaml}
            >
            </TextEditor>
          </DialogContent>
        </Dialog>
      </div>
    )
  }
}
export default withStyles(styles)(EditorDialog)