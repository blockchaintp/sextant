import * as React from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
} from '@mui/material'
import { ButtonProps } from '@mui/material/Button'

interface DeletePodDialogProps {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
  title: string
}

export interface CIButtonProps extends ButtonProps {
  _ci?: string
}

const CIButton = ({ _ci, ...rest }: CIButtonProps) => {
  return <Button {...rest} />
}

const DeletePodDialog: React.FC<DeletePodDialogProps> = ({
  open,
  onCancel,
  onConfirm,
  title,
}) => {
  const [name, setName] = React.useState('')
  const [error, setError] = React.useState(true)

  const handleChange = (resourceName: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if (value === resourceName) setError(false)
    else setError(true)
    setName(value)
  }

  const clearAndClose = () => {
    onCancel()
    setName('')
    setError(true)
  }

  const confirmAndClose = () => {
    onConfirm()
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
      <DialogTitle id="alert-dialog-title">{`Are you sure you want to delete ${title}?`}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Deleting this pod will remove it from the cluster.
          It may be recreated automatically if it is part of a
          StatefulSet, ReplicaSet, DaemonSet, or DaemonSet.
        </DialogContentText>
        <TextField
          helperText="Type the name of the resource you want to delete."
          error={error}
          id="standard-name"
          label="Pod Name"
          value={name}
          onChange={handleChange(title)}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={clearAndClose}>
          Cancel
        </Button>
        <CIButton _ci="confirm" id="podDeleteConfirm" disabled={error} onClick={confirmAndClose} variant="contained" color="primary" autoFocus>
          Confirm
        </CIButton>
      </DialogActions>
    </Dialog>
  )
}

export default DeletePodDialog
