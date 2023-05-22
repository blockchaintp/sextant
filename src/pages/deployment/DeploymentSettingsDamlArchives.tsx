/* eslint-disable no-else-return */
import * as React from 'react'
import { styled } from '@mui/system';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  Button,
  Typography,
} from '@mui/material'

import DamlArchiveTable from '../../components/table/DamlArchiveTable'
import SimpleTableHeader from '../../components/table/SimpleTableHeader'

import Loading from '../../components/system/Loading'
import DropZone from '../../components/uploader/DropZone'
import UploadFileProgressBar from '../../components/uploader/UploadFileProgressBar'

import settings from '../../settings'

const UploadIcon = settings.icons.upload

interface DeploymentSettingsDamlArchivesProps {
  cluster: string;
  id: string;
  inProgress: boolean;
  error: string | null;
  status: {[key: string]: any};
  uploadArchive: (params: any) => void; // Replace with the actual type of `params`
  uploadArchiveWindowOpen: boolean;
  setUploadArchiveWindowOpen: (isOpen: boolean) => void;
  onCancel: () => void;
  clearError: () => void;
  archives: {
    id: string
    packageId: string
    modules: string[]
    [key: string]: string | string[] | number | number[]
  }[];
}

const Root = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
}))

const StypedPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
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

const SpanCTA = styled('span')(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  margin: theme.spacing(1),
}))

const CenteredAlignDiv = styled('div')({
  textAlign: 'center',
})

const DeploymentSettingsDamlArchives: React.FC<DeploymentSettingsDamlArchivesProps> = ({
  cluster,
  id,
  inProgress,
  error,
  status,
  uploadArchive,
  uploadArchiveWindowOpen,
  setUploadArchiveWindowOpen,
  onCancel,
  clearError,
  archives,
}) => {

  const getUploaderContent = () => {
    if (error) {
      return <ErrorText>{ error }</ErrorText>
    } else if (inProgress) {
      // we have limited the dropzone to single files so we are only dealing with
      // a single file
      const filename = Object.keys(status)[0]
      const uploadInfo = status[filename]

      if (uploadInfo.percentDone >= 100) {
        return (
          <CenteredAlignDiv>
            <Loading />
            <DialogContentText>
              We are now packaging and uploading your archive to the DAML api server
            </DialogContentText>
          </CenteredAlignDiv>
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
          onDrop={(files: File[]) => uploadArchive({
            cluster,
            id,
            files,
          })}
        >
          <DropZoneContent>
            <Typography>
              Drag files here or
              <SpanCTA>
                click
              </SpanCTA>
              to select file
            </Typography>
          </DropZoneContent>
        </DropZone>
      )
    }
  }

  const closeAndClear = () => {
    setUploadArchiveWindowOpen(false)
    clearError()
  }

  const Uploader: React.FC<{
    uploadArchiveWindowOpen: boolean,
    setUploadArchiveWindowOpen: (isOpen: boolean) => void,
    inProgress: boolean,
    onCancel: () => void,
    getUploaderContent: () => JSX.Element,
  }> = ({
    uploadArchiveWindowOpen,
    setUploadArchiveWindowOpen,
    inProgress,
    onCancel,
    getUploaderContent,
  }) => (
    <Dialog
      open={uploadArchiveWindowOpen}
      onClose={() => setUploadArchiveWindowOpen(false)}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>Upload Package</DialogTitle>
      <DialogContent>
        { getUploaderContent() }
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
  );

  const Packages: React.FC<{
    data: {
      [key: string]: string | string[];
        id: string;
      }[]
    setUploadArchiveWindowOpen: (isOpen: boolean) => void,
  }> = ({
    data,
    setUploadArchiveWindowOpen,
  }) => {
    const fields = [{
      title: 'Package Id',
      name: 'packageId',
    }]
    return (
      <div>
        <SimpleTableHeader
          title="Packages"
          getActions={() => (
            <Button
              color="primary"
              variant="contained"
              onClick={() => setUploadArchiveWindowOpen(true)}
              disabled={false}
            >
              Upload
              <UploadIcon sx={{ marginLeft: 2 }} />
            </Button>
          )}
        />
        <DamlArchiveTable
          data={data}
          fields={fields}
        />
      </div>
    )
  }

  const integers = new Uint32Array(10);
  const randomNumbers = window.crypto.getRandomValues(integers);
  const randomNumber = randomNumbers[0]

  const data = archives.map((archive) => ({
    ...archive,
    id: `archive.packageId-${randomNumber}`, // Needed to generate table rows
    packageId: archive.packageId,
    modules: archive.modules,
  }))

  return (
    <Root>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <StypedPaper>
            <Packages
              data={data}
              setUploadArchiveWindowOpen={setUploadArchiveWindowOpen}
            />
          </StypedPaper>
        </Grid>
      </Grid>
      <Uploader
        uploadArchiveWindowOpen={uploadArchiveWindowOpen}
        setUploadArchiveWindowOpen={setUploadArchiveWindowOpen}
        inProgress={inProgress}
        onCancel={onCancel}
        getUploaderContent={getUploaderContent}
      />
    </Root>
  )
}

export default DeploymentSettingsDamlArchives
