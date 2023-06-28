import * as React from 'react';
import { styled } from '@mui/system'
import { Button } from '@mui/material'
import { ButtonProps } from '@mui/material/Button/Button'

import EditorDialog from './EditorDialog'

interface EditorButtonProps {
  yamlInput: string
  saveYamlInput: (input: string) => void
  inputToState: (input: string) => void
  customYaml: string
}

const StyledButton = styled(Button)(({ theme }) => ({
  marginRight: theme.spacing(2),
}))

interface CIButtonProps extends ButtonProps {
  _ci?: string
}

const CIButton = ({ _ci, ...rest }: CIButtonProps) => {
  return <StyledButton {...rest} />;
}

const EditorButton: React.FC<EditorButtonProps> = ({ yamlInput, saveYamlInput, inputToState, customYaml }) => {
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSave = (payload: string) => {
    saveYamlInput(payload)
    inputToState(payload)
    handleClose()
  }

  return (
    <div>
      <CIButton
        id="additionalyamlBttn"
        size="small"
        onClick={handleClickOpen}
        type="button"
        variant="contained"
      >
        Additional YAML
      </CIButton>
      <EditorDialog
        cancel={handleClose}
        open={open}
        save={handleSave}
        yamlInput={yamlInput}
        inputToState={inputToState}
        customYaml={customYaml}
      />
    </div>
  )
}

export default EditorButton
