import React from 'react';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'


import EditorButton from './EditorButton'


const styles = theme => ({
  warning: {
    padding: theme.spacing.unit * 2,
    color: "red"
  },
  details: {
    padding: theme.spacing.unit * 3,
    display: "flex",
    flexDirection: "row",
    alignItems: 'center'
  },
})

class CustomizationPanel extends React.Component {
  render() {
    const {
      classes,
      saveYamlInput,
      yamlInput,
      customYaml,
      inputToState
    } = this.props

    return (
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Advanced Deployment Customization</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.details}>
          <EditorButton inputToState={inputToState} saveYamlInput={saveYamlInput} yamlInput={yamlInput} customYaml={customYaml}>
          </EditorButton>
          <Typography className={classes.warning}>
            WARNING: This will overwrite default template options!
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    )
  }
}
export default withStyles(styles)(CustomizationPanel)