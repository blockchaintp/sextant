import * as React from 'react'
import { styled } from '@mui/system'
import {
  DialogContent,
  DialogTitle,
  Dialog,
  Typography,
} from '@mui/material'
import TextEditor from './TextEditor'

const Warning = styled(Typography)({
  color: 'red',
})

interface EditorDialogProps {
  cancel: () => void
  save: (payload: string) => void
  open: boolean
  yamlInput: string
  inputToState: (input: string) => void
  customYaml: string
}

const EditorDialog: React.FC<EditorDialogProps> = ({cancel, save, open, yamlInput, inputToState, customYaml}) => {

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === 'Enter') {
      e.stopPropagation()
    }
  }

  return (
    <div onKeyDown={handleKeyDown}>
      <Dialog
        open={open}
        onClose={cancel}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>Additional YAML</DialogTitle>
        <DialogContent>
          <Warning>
            You can add custom yaml here which will be merged with Sextant&apos;s default deployment templates. Warning, this can break your deployment, use with care.
          </Warning>
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

export default EditorDialog
