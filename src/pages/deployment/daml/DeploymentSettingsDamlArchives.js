/* eslint-disable no-else-return */
import React from 'react'
import { styled } from '@mui/system'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

import DamlArchiveTable from 'components/table/DamlArchiveTable'
import SimpleTableHeader from 'components/table/SimpleTableHeader'

import Loading from 'components/system/Loading'
import DropZone from 'components/uploader/DropZone'
import UploadFileProgressBar from 'components/uploader/UploadFileProgressBar'

import settings from 'settings'

const UploadIcon = settings.icons.upload

const Root = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
}))

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(2),
}))

const ErrorText = styled(DialogContentText)({
  color: '#cc0000',
})

const DropZoneContent = styled('div')(({ theme }) => ({
  padding: theme.spacing(4),
  border: '1px dashed #ccc',
  textAlign: 'center',
  cursor: 'pointer',
}))

const ClickMe = styled('span')(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  margin: theme.spacing(1),
}))

const CenterAlign = styled('div')({
  textAlign: 'center',
})

class DeploymentSettingsDamlArchives extends React.Component {
  getUploaderContent = () => {
    const {
      cluster,
      id,
      inProgress,
      error,
      status,
      uploadArchive,
    } = this.props

    if (error) {
      return (
        <ErrorText>{ error }</ErrorText>
      )
    } else if (inProgress) {
      // we have limited the dropzone to single files so we are only dealing with
      // a single file
      const filename = Object.keys(status)[0]
      const uploadInfo = status[filename]

      if (uploadInfo.percentDone >= 100) {
        return (
          <CenterAlign>
            <Loading />
            <DialogContentText>
              We are now packaging and uploading your archive to the DAML api server
            </DialogContentText>
          </CenterAlign>
        )
      } else {
        return (
          <UploadFileProgressBar
            filename={filename}
            size={uploadInfo.size}
            percentDone={uploadInfo.percentDone}
            remainingTime={uploadInfo.remainingTime}
            uploadedBytes={uploadInfo.uploadedBytes}
            color="primary"
          />
        )
      }
    } else {
      return (
        <DropZone
          accept=".dar"
          onDrop={(files) => uploadArchive({
            cluster,
            id,
            files,
          })}
        >
          <DropZoneContent>
            <Typography>
              Drag files here or
              <ClickMe>
                click
              </ClickMe>
              to select file
            </Typography>
          </DropZoneContent>
        </DropZone>
      )
    }
  }

  getUploader = () => {
    const {
      uploadArchiveWindowOpen,
      setUploadArchiveWindowOpen,
      inProgress,
      onCancel,
      clearError,
    } = this.props

    const closeAndClear = () => {
      setUploadArchiveWindowOpen(false)
      clearError()
    }

    return (
      <Dialog
        open={uploadArchiveWindowOpen}
        onClose={() => setUploadArchiveWindowOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Upload Package</DialogTitle>
        <DialogContent>
          {
            this.getUploaderContent()
          }
        </DialogContent>
        <DialogActions>
          {
            inProgress ? (
              <Button onClick={onCancel}>
                Cancel
              </Button>
            ) : (
              <Button onClick={closeAndClear}>
                Close
              </Button>
            )
          }
        </DialogActions>
      </Dialog>
    )
  }

  getUploadButton = () => {
    const { setUploadArchiveWindowOpen } = this.props
    return (
      <Button
        color="primary"
        variant="contained"
        onClick={() => setUploadArchiveWindowOpen(true)}
        disabled={false}
      >
        Upload
        <UploadIcon sx={{ marginLeft: 1 }} />
      </Button>
    );
  }

  getPackages = () => {
    const {
      archives,
    } = this.props

    const fields = [{
      title: 'Package Id',
      name: 'packageId',
    }]

    const integers = new Uint32Array(10)
    const randomNumbers = window.crypto.getRandomValues(integers)
    const randomNumber = randomNumbers[0]

    const data = archives.map((archive) => ({
      ...archive,
      id: `archive.packageId-${randomNumber}`, // Needed to generate table rows
      packageId: archive.packageId,
      modules: archive.modules,
    }))

    return (
      <div>
        <SimpleTableHeader
          title="Packages"
          getActions={this.getUploadButton}
        />
        <DamlArchiveTable
          data={data}
          fields={fields}
        />
      </div>
    )
  }

  render() {
    return (
      <Root>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <StyledPaper>
              { this.getPackages() }
            </StyledPaper>
          </Grid>
        </Grid>
        { this.getUploader() }
      </Root>
    )
  }
}

export default DeploymentSettingsDamlArchives
