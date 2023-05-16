import React from 'react'
import { styled } from '@mui/system';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material'
import { ButtonProps } from '@mui/material/Button'

interface EditRoleDialogProps {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
  level: string
  setLevel: (role: string) => void
}

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  margin: theme.spacing(1),
  width: '100%',
}))

export interface CIButtonProps extends ButtonProps {
  _ci?: string
}

const CIButton = ({ _ci, ...rest }: CIButtonProps) => {
  return <Button {...rest} />
}

const EditRoleDialog: React.FC<EditRoleDialogProps> = ({
  open,
  onCancel,
  onConfirm,
  level,
  setLevel,
}) => {
  const [role, setRole] = React.useState(level)

  const handleRoleChange = (newRole: string) => {
    setRole(newRole)
    setLevel(newRole)
  }

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Edit Role</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          You may only edit the role.
        </DialogContentText>
        <StyledFormControl>
          <InputLabel>
            Access Level
          </InputLabel>
          <Select
            value={role}
            onChange={(e) => handleRoleChange(e.target.value)}
            displayEmpty
            label="Access Level"
            name="accessLevel"
          >
            <MenuItem value="read">Read</MenuItem>
            <MenuItem value="write">Write</MenuItem>
          </Select>
          <FormHelperText>Choose the level of access you want to give this user</FormHelperText>
        </StyledFormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>
          Cancel
        </Button>
        <CIButton _ci="confirm" onClick={onConfirm} variant="contained" color="primary" autoFocus>
          Confirm
        </CIButton>
      </DialogActions>
    </Dialog>
  )
}

export default EditRoleDialog
