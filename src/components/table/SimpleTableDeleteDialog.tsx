import * as React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import { ButtonProps } from '@mui/material/Button'

type SimpleTableDeleteDialogProps = {
    open: boolean,
    onCancel: () => void,
    onConfirm: () => void,
    title: string,
}

interface CIButtonProps extends ButtonProps {
  _ci?: string
}

const CIButton = ({ _ci, ...rest }: CIButtonProps) => {
  return <Button {...rest} />
}

const SimpleTableDeleteDialog: React.FC<SimpleTableDeleteDialogProps> = ({
  open,
  onCancel,
  onConfirm,
  title, }) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{`Delete ${title}`}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {`Are you sure you want to delete ${title}?`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>
          Cancel
        </Button>
        <CIButton _ci="confirm" id="simpleTableDeleteConfirm" onClick={onConfirm} variant="contained" color="primary" autoFocus>
          Confirm
        </CIButton>
      </DialogActions>
    </Dialog>
  )
}

export default SimpleTableDeleteDialog
