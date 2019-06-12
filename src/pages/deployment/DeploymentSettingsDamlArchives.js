import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import SimpleTable from 'components/table/SimpleTable'
import SimpleTableHeader from 'components/table/SimpleTableHeader'

import DropZone from 'components/uploader/DropZone'
import UploadFileProgressBar from 'components/uploader/UploadFileProgressBar'

import settings from 'settings'

const UploadIcon = settings.icons.upload

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 2,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    margin: theme.spacing.unit * 2,
  },
  formTextContainer: {
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
  },
  buttonIcon: {
    marginLeft: theme.spacing.unit,
  },
  errorText: {
    color: '#cc0000',
  },
})

class DeploymentSettingsDamlArchives extends React.Component {

  getUploaderContent() {
    const {
      classes,
      cluster,
      id,
      inProgress,
      error,
      status,
      uploadArchive,
    } = this.props

    if(error) {
      return (
        <DialogContentText className={ classes.errorText }>{ error }</DialogContentText>
      )
    }
    else if(inProgress) {
      return Object.keys(status).map((filename, i) => {
        const uploadInfo = status[filename]
        return (
          <UploadFileProgressBar
            key={ i }
            filename={ filename }
            size={ uploadInfo.size }
            percentDone={ uploadInfo.percentDone }
            remainingTime={ uploadInfo.remainingTime }
            uploadedBytes={ uploadInfo.uploadedBytes }
            color="primary"
          />
        )
      })
    }
    else {
      return (
        <DropZone
          onDrop={ (files) => uploadArchive({
            cluster,
            id,
            files,
          }) }
        >
          <Paper className={ classes.root }>
            <Typography>Drag files here or click to select file</Typography>
          </Paper>
        </DropZone>
      )
    }
  }

  getUploader() {

    const {
      uploadArchiveWindowOpen,
      setUploadArchiveWindowOpen,
      inProgress,
      onCancel,
    } = this.props

    return (
      <Dialog
        open={ uploadArchiveWindowOpen }
        onClose={ () => setUploadArchiveWindowOpen(false) }
        fullWidth
        maxWidth='md'
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
              <Button onClick={ onCancel }>
                Cancel
              </Button>
            ) : (
              <Button onClick={ () => setUploadArchiveWindowOpen(false) }>
                Close
              </Button>
            )
          }
        </DialogActions>
      </Dialog>
    )
  }

  getPackages() {
    const {
      classes,
      damlArchives,
      setUploadArchiveWindowOpen,
    } = this.props

    const fields =[{
      title: 'Package Id',
      name: 'packageid',
    },{
      title: 'Size',
      name: 'size',
    },{
      title: 'Uploaded By',
      name: 'uploadedBy',
    },{
      title: 'Uploaded',
      name: 'uploaded',
    }]

    const data = damlArchives.map(archive => {
      return Object.assign({}, archive, {
        id: archive.packageid,
      })
    })

    return (
      <div>
        <SimpleTableHeader
          title="Packages"
          getActions={ () => (
            <Button 
              color="secondary"
              variant="contained"
              onClick={ () => setUploadArchiveWindowOpen(true) }
            >
              Upload
              <UploadIcon className={ classes.buttonIcon } />
            </Button>
          ) }
        />
        <SimpleTable
          data={ data }
          fields={ fields }
        />
      </div>
    )
                
  }

  render() {
    const {
      classes,
    } = this.props

    return (
      <div className={ classes.root }>
        <Grid container spacing={24}>
          <Grid item xs={ 12 }>
            <Paper className={ classes.paper }>
              { this.getPackages() }
            </Paper>
          </Grid>
        </Grid>
        { this.getUploader() }
      </div>
    )
  }
}

DeploymentSettingsDamlArchives.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(DeploymentSettingsDamlArchives)