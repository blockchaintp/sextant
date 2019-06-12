import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import TextField from '@material-ui/core/TextField'

import SimpleTable from 'components/table/SimpleTable'
import SimpleTableHeader from 'components/table/SimpleTableHeader'

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
})

class DeploymentSettingsDamlArchives extends React.Component {

  getUploader() {

    const {
      inProgress,
      error,
      status,
      onUploadFiles,
    } = this.props

    return (
      <Dialog
        open={ false }
        onClose={ () => {} }
        fullWidth
        maxWidth='md'
      >
        <DialogTitle>Upload Package</DialogTitle>
        <DialogContent>
          <DropZone
            onDrop={ onUploadFiles }
          >
            <Paper className={ classes.root }>
              <Typography>Drag files here or click to select file</Typography>
            </Paper>
          </DropZone>
          <UploadStatusDialog
            inProgress={ inProgress }
            error={ error }
            status={ status }
            onFinish={ onFinish }
            onCancel={ onCancel }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={ () => this.cancel() }>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  getPackages() {
    const {
      classes,
      damlArchives,
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
              onClick={ () => {} }
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
        
      </div>
    )
  }
}

DeploymentSettingsDamlArchives.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(DeploymentSettingsDamlArchives)