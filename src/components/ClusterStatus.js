import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'

import ConfirmDeleteClusterDialog from './ConfirmDeleteClusterDialog'
import ConfirmUndeployClusterDialog from './ConfirmUndeployClusterDialog'

const styles = theme => {
  return {
    errorText: {
      color: 'red',
      marginBottom: '10px',
    },
    paper: {
      padding: theme.spacing.unit * 2,
      marginBottom: '20px',
    },
    statusText: {
      marginBottom: '10px',
    },
    title: {
      marginBottom: theme.spacing.unit * 2,
    },
    button: {
      margin: theme.spacing.unit,
    },
  }
}

class ClusterStatus extends React.Component {

  state = {
    deleteCluster: null,
    undeployCluster: null,
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

  onUndeployClick() {
    const { cluster } = this.props
    this.setState({
      undeployCluster: cluster,
    })
  }

  onUndeployClose() {
    this.setState({
      undeployCluster: null,
    })
  }

  onUndeployConfirm() {
    const { cluster } = this.props
    this.props.onUndeployCluster()
    this.onUndeployClose()
  }

  getKubeConfigDownload() {
    const { classes } = this.props
    return this.props.kubeConfigExists ? (
      <Button 
        className={ classes.button }
        color="primary" 
        variant="contained"
        size="small"
        autoFocus
        onClick={ this.props.downloadKubeConfig }
      >
        Download Kube Config
      </Button>
    ) : null
  }

  getDashboardButton() {
    const { cluster, classes } = this.props
    const { settings, status } = cluster

    if(status.phase != 'deployed') return null

    return (
      <Button 
        className={ classes.button }
        color="primary" 
        variant="contained"
        size="small"
        autoFocus
        onClick={ () => this.props.onOpenDashboard() }
      >
        Open Dashboard
      </Button>
    )
  }

  getMonitoringButton() {
    const { cluster, classes } = this.props
    const { settings, status } = cluster

    if(status.phase != 'deployed') return null

    return (
      <Button 
        className={ classes.button }
        color="primary" 
        variant="contained"
        size="small"
        autoFocus
        onClick={ () => this.props.onOpenMonitoring() }
      >
        Open Monitoring
      </Button>
    )
  }

  getUndeploySawtooth() {
    const { classes } = this.props
    return this.props.kubeConfigExists ? (
      <Button 
        className={ classes.button }
        color="secondary" 
        variant="contained"
        size="small"
        autoFocus
        onClick={ () => this.onUndeployClick() }
      >
        Undeploy Sawtooth
      </Button>
    ) : null
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
        { this.getKubeConfigDownload() }
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
        { this.getKubeConfigDownload() }
      
        <Button 
          className={ classes.button }
          color="secondary" 
          variant="contained"
          size="small"
          autoFocus
          onClick={ () => this.onDeleteClick() }
        >
          Delete Cluster
        </Button>
      </div>
    )
  }

  getClusterUndeploying() {
    const { classes } = this.props
    return (
      <div>
        <Typography
          variant='subheading'
          className={ classes.statusText }
        >
          Undeploying
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

        { this.getKubeConfigDownload() }

        <Button 
          className={ classes.button }
          color="secondary" 
          variant="contained"
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
        <ConfirmUndeployClusterDialog
          cluster={ this.state.undeployCluster }
          onClose={ this.onUndeployClose.bind(this) }
          onConfirm={ this.onUndeployConfirm.bind(this) }
        />
        <Typography
          variant='subheading'
          className={ classes.statusText }
        >
          Deployed
        </Typography>

        { this.getKubeConfigDownload() }
        { this.getDashboardButton() }

        <Button 
          className={ classes.button }
          color="secondary" 
          variant="contained"
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
          variant="contained"
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
        <ConfirmDeleteClusterDialog
          cluster={ this.state.deleteCluster }
          onClose={ this.onDeleteClose.bind(this) }
          onConfirm={ this.onDeleteConfirm.bind(this) }
        />
        <ConfirmUndeployClusterDialog
          cluster={ this.state.undeployCluster }
          onClose={ this.onUndeployClose.bind(this) }
          onConfirm={ this.onUndeployConfirm.bind(this) }
        />
        <Typography
          variant='subheading'
          className={ classes.errorText }
        >
          Error
        </Typography>
        <Typography
          variant='body1'
          className={ classes.errorText }
        >
          { status.error }
        </Typography>

        { this.getKubeConfigDownload() }

        {
          status.clusterExists ? (
            <Button 
              className={ classes.button }
              color="secondary" 
              variant="contained"
              size="small"
              autoFocus
              onClick={ () => this.props.onDeleteCluster() }
            >
              Delete Cluster
            </Button>
          ) : (
            <Button 
              className={ classes.button }
              color="secondary" 
              variant="contained"
              size="small"
              autoFocus
              onClick={ () => this.props.onCleanupCluster() }
            >
              Cleanup Cluster
            </Button>
          )
        }
        
        
      </div>
    )
  }

  getKubernetesBlock() {
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
    else if(status.phase == 'undeploying') {
      return this.getClusterUndeploying()
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

  getSawtoothBlock() {
    const { cluster, classes } = this.props
    const { settings, status } = cluster

    const okPhases = {
      deploying: true,
      deployed: true,
    }

    const okErrorPhases = {
      deploy: true, 
    }

    if(!okPhases[status.phase] && !okErrorPhases[status.errorPhase]) return null

    return (
      <Paper
          className={ classes.paper }
        >
        <Typography
          variant='h6'
          className={ classes.title }
        >
          Sawtooth
        </Typography>

        { this.getMonitoringButton() }
        { this.getUndeploySawtooth() }

      </Paper>
    )
  }

  render() {
    const { cluster, classes } = this.props
    const { settings, status } = cluster

    return (
      <div>
        <Paper
          className={ classes.paper }
        >
          <Typography
            variant='h6'
            className={ classes.title }
          >
            Kubernetes
          </Typography>

          { this.getKubernetesBlock() }

        </Paper>

        { this.getSawtoothBlock() }

        
      </div>
    )
  }
}

ClusterStatus.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(ClusterStatus)