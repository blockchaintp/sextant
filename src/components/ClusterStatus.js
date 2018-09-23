import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'

import ConfirmDeleteClusterDialog from './ConfirmDeleteClusterDialog'

const styles = theme => {
  return {
    errorText: {
      color: 'red',
      marginBottom: '10px',
    },
    statusText: {
      marginBottom: '10px',
    },
    button: {
      margin: theme.spacing.unit,
    },
  }
}

class ClusterStatus extends React.Component {

  state = {
    deleteCluster: null,
  }

  onDeleteClick() {
    const { cluster } = this.props
    this.setState({
      deleteCluster: cluster,
    })
  }

  onDeleteClose() {
    this.setState({
      deleteCluster: null,
    })
  }

  onDeleteConfirm() {
    const { cluster } = this.props
    this.props.onDeleteCluster()
    this.onDeleteClose()
  }

  getClusterCreating() {
    const { classes } = this.props
    return (
      <div>
        <Typography
          variant='subheading'
          className={ classes.statusText }
        >
          Creating (this can take between 5 and 10 minutes)...
        </Typography>
        <CircularProgress
          className={ classes.progress }
          size={ 20 }
        />
      </div>
    )
  }

  getClusterDeploying() {
    const { classes } = this.props
    return (
      <div>
        <Typography
          variant='subheading'
          className={ classes.statusText }
        >
          Deploying
        </Typography>
        <CircularProgress
          className={ classes.progress }
          size={ 20 }
        />
      </div>
    )
  }

  getClusterCreated() {
    const { classes } = this.props
    return (
      <div>
        <ConfirmDeleteClusterDialog
          cluster={ this.state.deleteCluster }
          onClose={ this.onDeleteClose.bind(this) }
          onConfirm={ this.onDeleteConfirm.bind(this) }
        />
        <Typography
          variant='subheading'
          className={ classes.statusText }
        >
          Created
        </Typography>
        <Button 
          className={ classes.button }
          color="secondary" 
          variant="raised"
          size="small"
          autoFocus
          onClick={ () => this.onDeleteClick() }
        >
          Delete Cluster
        </Button>
      </div>
    )
  }

  getClusterDeployed() {
    const { classes } = this.props
    return (
      <div>
        <ConfirmDeleteClusterDialog
          cluster={ this.state.deleteCluster }
          onClose={ this.onDeleteClose.bind(this) }
          onConfirm={ this.onDeleteConfirm.bind(this) }
        />
        <Typography
          variant='subheading'
          className={ classes.statusText }
        >
          Deployed
        </Typography>
        <Button 
          className={ classes.button }
          color="secondary" 
          variant="raised"
          size="small"
          autoFocus
          onClick={ () => this.onDeleteClick() }
        >
          Delete Cluster
        </Button>
      </div>
    )
  }

  getClusterDeleting() {
    const { classes } = this.props
    return (
      <div>
        <Typography
          variant='subheading'
          className={ classes.statusText }
        >
          Deleting...
        </Typography>
        <CircularProgress
          className={ classes.progress }
          size={ 20 }
        />
      </div>
    )
  }

  getClusterDeleted() {
    const { classes } = this.props
    return (
      <div>
        <Typography
          variant='subheading'
          className={ classes.statusText }
        >
          Deleted
        </Typography>
        <Button 
          className={ classes.button }
          color="secondary" 
          variant="raised"
          size="small"
          autoFocus
          onClick={ () => this.props.onCleanupCluster() }
        >
          Clean Up
        </Button>
      </div>
    )
  }

  getClusterError() {
    const { cluster, classes } = this.props
    const { settings, status } = cluster

    return (
      <div>
        <Typography
          variant='subheading'
          className={ classes.errorText }
        >
          Error
        </Typography>
        <Typography
          variant='body2'
          className={ classes.errorText }
        >
          { status.error }
        </Typography>
        <Button 
          className={ classes.button }
          color="secondary" 
          variant="raised"
          size="small"
          autoFocus
          onClick={ () => this.props.onDeleteCluster() }
        >
          Delete Cluster
        </Button>
      </div>
    )
  }

  render() {
    const { cluster, classes } = this.props
    const { settings, status } = cluster

    if(status.phase == 'creating') {
      return this.getClusterCreating()
    }
    else if(status.phase == 'created') {
      return this.getClusterCreated()
    }
    else if(status.phase == 'deploying') {
      return this.getClusterDeploying()
    }
    else if(status.phase == 'deployed') {
      return this.getClusterDeployed()
    }
    else if(status.phase == 'deleting') {
      return this.getClusterDeleting()
    }
    else if(status.phase == 'deleted') {
      return this.getClusterDeleted()
    }
    else if(status.phase == 'error') {
      return this.getClusterError()
    }
    else {
      return (
        <div>
          <Typography
            variant='subheading'
          >
            Unknown Status: { status.phase }
          </Typography>
        </div>
      )
    }
  }
}

ClusterStatus.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(ClusterStatus)