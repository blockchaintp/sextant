import React from 'react';

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'


import EditorDialog from './EditorDialog'

const styles = theme => {
  return {
    button: {
      marginRight: theme.spacing.unit * 2,
    },
  }
}

class EditorButton extends React.Component {
  state = {
    open: false,
  }

  constructor(props) {
    super(props)
    this.handleClickOpen = this.handleClickOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  }

  handleClose = () => {
    this.setState({ open: false });
  }

  render() {
    const {
      classes,
      customInput,
      saveCustomInput,
      inputToState,
      inputYaml
    } = this.props


    const handleSave = (payload) => {
      saveCustomInput(payload)
      inputToState(payload)
      this.handleClose()
    }

    return (
      <div>
        <Button
          size='small'
          onClick={this.handleClickOpen}
          className={classes.button}
          type="button"
          variant="contained"
        >
          Additional YAML
        </Button>
        <EditorDialog
          cancel={this.handleClose}
          open={this.state.open}
          save={handleSave}
          customInput={customInput}
          inputToState={inputToState}
          inputYaml={inputYaml}
        >
        </EditorDialog>
      </div>
    )
  }
}


export default withStyles(styles)(EditorButton)