import React from 'react'
import PropTypes from 'prop-types'
import { connectStore } from 'redux-box'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import { lighten } from '@material-ui/core/styles/colorManipulator'

import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'

import Loading from '../components/Loading'
import ClusterDetails from '../components/ClusterDetails'

import settings from '../settings'
import clusterModule from '../store/cluster'

const styles = theme => {
  return {
    container: {
      //marginTop: theme.spacing.unit * 2,
      padding: theme.spacing.unit * 2,
    },
    paper: {
      padding: theme.spacing.unit * 2,
    },
    title: {
      marginBottom: theme.spacing.unit * 2,
    },
    progressContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    progress: {
      margin: theme.spacing.unit * 2,
    },
    errorText: {
      color: 'red',
    },
  }

}

@connectStore({
  cluster: clusterModule,
})
class ClusterView extends React.Component {
  
  componentDidMount(){
    this.props.cluster.setClusterData(null)
    this.props.cluster.loadClusterData()
  }

  componentWillUnmount() {
    this.props.cluster.stopClusterCreatingLoop()
  }

  getClusterCreating() {
    const { classes } = this.props

    return (
      <div>
        <Typography
          variant='subheading'
        >
          Creating
        </Typography>
        <CircularProgress
          className={ classes.progress }
          size={ 20 }
        />
      </div>
    )
  }

  getClusterError() {
    const { cluster, classes } = this.props
    const { currentClusterData } = cluster
    const { settings, status } = currentClusterData

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
      </div>
    )
  }

  getClusterStatus() {
    const { cluster, classes } = this.props
    const { currentClusterData } = cluster
    const { settings, status } = currentClusterData

    if(status.phase == 'creating') {
      return this.getClusterCreating()
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

  render() {

    const { cluster, classes } = this.props
    const { currentClusterData } = cluster
    if(!currentClusterData) {
      return (
        <Loading />
      )
    }

    return (
      <Grid
        container
        spacing={ 24 }
        direction='row'
        className={ classes.container }
      >

        <Grid
          item
          sm={12}
          md={8}
        >
          <Paper
            className={ classes.paper }
          >
            <Typography
              variant='title'
              className={ classes.title }
            >
              Cluster Status
            </Typography>

            { this.getClusterStatus() }
          </Paper>
        </Grid>

        <Grid
          item
          sm={12}
          md={4}
        >
          <Paper
            className={ classes.paper }
          >
            <Typography
              variant='title'
              className={ classes.title }
            >
              Cluster Settings
            </Typography>
            <ClusterDetails
              cluster={ currentClusterData }
            />
          </Paper>
        </Grid>

      </Grid>
    )
  }
}

ClusterView.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(ClusterView)