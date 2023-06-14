import * as React from 'react'
import { styled } from '@mui/system'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'
import { AccordionSummaryProps } from '@mui/material/AccordionSummary/AccordionSummary'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Typography from '@mui/material/Typography'

import EditorButton from './EditorButton'

interface CIAccordionSummaryProps extends AccordionSummaryProps {
  _ci?: string
}

const CIAccordionSummary = ({ _ci, ...rest }: CIAccordionSummaryProps) => {
  return <AccordionSummary {...rest} />;
}

type CustomizationPanelProps = {
  saveYamlInput: (input: string) => void
  yamlInput: string
  customYaml: string
  inputToState: (input: string) => void
}

const StyledWarning = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(2),
  color: 'red',
}))

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
}))

const CustomizationPanel: React.FC<CustomizationPanelProps> = ({ inputToState, saveYamlInput, yamlInput, customYaml }) => {

    return (
      <Accordion>
        <CIAccordionSummary expandIcon={<ExpandMoreIcon />} _ci="advancedaccordion">
          <Typography>Advanced Deployment Customization</Typography>
        </CIAccordionSummary>
        <StyledAccordionDetails>
          <EditorButton
            inputToState={inputToState}
            saveYamlInput={saveYamlInput}
            yamlInput={yamlInput}
            customYaml={customYaml}
          />
          <StyledWarning>
            WARNING: This will overwrite default template options!
          </StyledWarning>
        </StyledAccordionDetails>
      </Accordion>
    )
}
export default CustomizationPanel
