import * as React from 'react'
import { useState } from 'react'

import Button, { ButtonProps } from '@mui/material/Button'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'

import TextField from '@mui/material/TextField'

import { getDialogDeleteText } from '../../utils/translators'

interface SimpleTableTripleDeleteDialogProps {
  open: boolean,
  onCancel: Function,
  onConfirm: Function,
  title: string,
  resource: {
    status: string,
    name: string,
  } | null,
  resourceType: string,
}

interface SimpleTableTripleDeleteDialogState {
  name: string,
  error: boolean,
}

interface CIButtonProps extends ButtonProps {
  _ci?: string
}

const CIButton = ({ _ci, ...rest }: CIButtonProps) => {
  return <Button {...rest} />;
}


const SimpleTableTripleDeleteDialog: React.FC<SimpleTableTripleDeleteDialogProps> = ({
  open,
  onCancel,
  onConfirm,
  title,
  resource,
  resourceType,
}) => {
  const [name, setName] = useState('');
  const [error, setError] = useState(true);
  const text = resource ? getDialogDeleteText(resource.status) : { title: 'Delete', subtext: 'delete' };
  const resourceName = resource ? resource.name : null;

  const handleChange = (resourceName: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if (value === resourceName) {
      setError(false);
    }
    else {
      setError(true);
    }
    setName(value);
  }

  const validateAndConfirm = (input: string, expected: string) => {
    if (input === expected) {
      onConfirm()
      setName('')
    } else {
      setName('')
    }
  }

  const clearAndClose = () => {
    onCancel()
    setName('')
    setError(true)
  }

  return (
    <Dialog
      open={open}
      onClose={clearAndClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{`${text.title} ${title}`}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {`Are you sure you want to ${text.subtext} ${title}?`}
        </DialogContentText>
        <TextField
          helperText="Type the name of the resource you want to delete."
          error={error}
          id="standard-name"
          label={`${resourceType} name`}
          value={name}
          onChange={handleChange(resourceName)}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={clearAndClose}>
          Cancel
        </Button>
        <CIButton
          disabled={error}
          _ci="confirm"
          id="simpleTableDeleteConfirm"
          onClick={() => validateAndConfirm(name, resourceName)}
          variant="contained"
          color="primary"
          autoFocus
        >
          Confirm
        </CIButton>
      </DialogActions>
    </Dialog>
  )
}

export default SimpleTableTripleDeleteDialog
