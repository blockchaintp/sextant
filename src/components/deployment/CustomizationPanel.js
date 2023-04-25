import React from 'react';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import withStyles from '@mui/styles/withStyles';
import Typography from '@mui/material/Typography'

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
        <AccordionSummary expandIcon={<ExpandMoreIcon />} _ci="advancedaccordion">
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
