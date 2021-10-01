import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles';

import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'

import UploadFileProgressBar from './UploadFileProgressBar'

const styles = (theme) => ({
  errorText: {
    color: theme.palette.error.main,
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
})

class UploadStatusDialog extends React.Component {
  render() {
    const {
      classes,
      inProgress,
      error,
      status,
      onFinish,
      onCancel,
    } = this.props

    const fileCount = Object.keys(status).length

    const totals = Object.keys(status).reduce((all, key) => {
      all.size += status[key].size
      all.uploadedBytes += status[key].uploadedBytes
      return all
    }, {
      size: 0,
      uploadedBytes: 0,
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
                  color="secondary"
                />
                <Divider className={classes.divider} />
              </>
            )
          }

          {
            error ? (
              <DialogContentText className={classes.errorText}>{ error }</DialogContentText>
            ) : Object.keys(status).map((filename, i) => {
              const uploadInfo = status[filename]
              return (
                <UploadFileProgressBar
                  key={i}
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
}

UploadStatusDialog.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(UploadStatusDialog)
