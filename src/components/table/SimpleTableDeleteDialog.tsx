import * as React from 'react'
import { withStyles, createStyles } from '@mui/styles';

import Button, { ButtonProps } from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

import { getDialogDeleteText } from '../../utils/translators'

const styles = createStyles({
})

type SimpleTableDeleteDialogProps = {
    open: boolean,
    onCancel: () => void,
    onConfirm: () => void,
    title: string,
    resource: {
      title: string,
      status: string,
    } | null,
    resourceType: string,
}

interface CIButtonProps extends ButtonProps {
  _ci?: string
}

const CIButton = ({ _ci, ...rest }: CIButtonProps) => {
  return <Button {...rest} />;
}

const SimpleTableDeleteDialog: React.FC<SimpleTableDeleteDialogProps> = ({open, onCancel, onConfirm, resource, title }) => {
    const text = getDialogDeleteText(resource.status)

    return (
      <Dialog
        open={open}
        onClose={onCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`${text.title} ${title}`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Are you sure you want to ${text.subtext} ${title}?`}
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

export default withStyles(styles)(SimpleTableDeleteDialog)
