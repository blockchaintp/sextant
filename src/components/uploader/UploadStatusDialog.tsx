import React from 'react'
import { styled } from '@mui/system';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Divider,
} from '@mui/material'

import UploadFileProgressBar from './UploadFileProgressBar'

const ErrorDialogContentText = styled(DialogContentText)(({ theme }) => ({
  color: theme.palette.error.main,
}))

const StyledDivider = styled(Divider)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}))

interface UploadStatusDialogProps {
  inProgress: boolean
  error: string
  status: {
    [key: string]: {
      size: number
      uploadedBytes: number
      percentDone: number
      remainingTime: number
    }
  }
  onFinish: () => void
  onCancel: () => void
}

const UploadStatusDialog: React.FC<UploadStatusDialogProps> = ({
  inProgress,
  error,
  status,
  onFinish,
  onCancel,
}) => {

    const fileCount = Object.keys(status).length

    const totals = Object.keys(status).reduce((all, key) => {
      all.size += status[key].size
      all.uploadedBytes += status[key].uploadedBytes
      return all
    }, {
      size: 0,
      uploadedBytes: 0,
      percent: undefined,
    })

    totals.percent = Math.floor((totals.uploadedBytes / totals.size) * 100)

    const isDone = totals.percent >= 100

  return (
    <Dialog
      open={inProgress}
      onClose={() => {}}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth="md"
    >
      <DialogTitle id="alert-dialog-title">
        { isDone ? 'Uploaded' : 'Uploading' }
        {' '}
        { fileCount }
        {' '}
        file
        { fileCount === 1 ? '' : 's' }
      </DialogTitle>
      <DialogContent>

        {
          fileCount > 1 && (
            <>
              <UploadFileProgressBar
                filename={`${fileCount} file${fileCount === 1 ? '' : 's'}`}
                size={totals.size}
                percentDone={totals.percent}
                uploadedBytes={totals.uploadedBytes}
                color="primary"
              />
              <StyledDivider />
            </>
          )
        }

        {
          error ? (
            <ErrorDialogContentText>{ error }</ErrorDialogContentText>
          ) : Object.keys(status).map((filename) => {
            const uploadInfo = status[filename]
            return (
              <UploadFileProgressBar
                key={filename}
                filename={filename}
                size={uploadInfo.size}
                percentDone={uploadInfo.percentDone}
                remainingTime={uploadInfo.remainingTime}
                uploadedBytes={uploadInfo.uploadedBytes}
                color="primary"
              />
            )
          })
        }
      </DialogContent>
      <DialogActions>
        {
          (!isDone && !error) && (
            <Button onClick={() => onCancel()}>
              Cancel
            </Button>
          )
        }
        {
          (isDone || error) && (
            <Button onClick={() => onFinish()}>
              Close
            </Button>
          )
        }
      </DialogActions>
    </Dialog>
  )
}

export default UploadStatusDialog
