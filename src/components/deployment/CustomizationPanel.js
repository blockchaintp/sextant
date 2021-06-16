import React from 'react';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import EditorButton from './EditorButton'

const styles = (theme) => ({
  warning: {
    padding: theme.spacing(2),
    color: 'red',
  },
  details: {
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
})

class CustomizationPanel extends React.Component {
  render() {
    const {
      classes,
      saveYamlInput,
      yamlInput,
      customYaml,
      inputToState,
    } = this.props

    return (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Advanced Deployment Customization</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.details}>
          <EditorButton inputToState={inputToState} saveYamlInput={saveYamlInput} yamlInput={yamlInput} customYaml={customYaml} />
          <Typography className={classes.warning}>
            WARNING: This will overwrite default template options!
          </Typography>
        </AccordionDetails>
      </Accordion>
    )
  }
}
export default withStyles(styles)(CustomizationPanel)
