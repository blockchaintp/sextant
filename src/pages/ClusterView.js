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
import Button from '@material-ui/core/Button'

import Loading from '../components/Loading'
import ClusterDetails from '../components/ClusterDetails'
import ClusterStatus from '../components/ClusterStatus'
import ClusterAccess from '../components/ClusterAccess'
import ClusterResources from '../components/ClusterResources'
import DeploymentSettings from './DeploymentSettings'

import settings from '../settings'
import clusterModule from '../store/cluster'

import clusterUtils from '../utils/cluster'

const styles = theme => {
  return {
    container: {
      //marginTop: theme.spacing.unit * 2,
      padding: theme.spacing.unit * 2,
    },
    paper: {
      padding: theme.spacing.unit * 2,
      marginBottom: '20px',
    },
    button: {
      margin: theme.spacing.unit,
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

// phases where we want some kind of content as the main block on the page
const SHOW_CONTENT_PHASES = {
  error: true,
  created: true,
  deployed: true,
  undeploying: true,
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
    this.props.cluster.stopClusterStatusLoop()
    this.props.cluster.stopClusterInfoLoop()
  }

  render() {

    const { cluster, classes } = this.props
    const { currentClusterData, clusterInfo } = cluster

    let status = {phase:'none'}

    if(currentClusterData) {
      status = currentClusterData.status
    }

    if(!currentClusterData) {
      return (
        <Loading />
      )
    }

    // show the status full width in creating phase so errors show up
    // full screen
    const infoGridWidth = status.phase == 'error' ? 12 : 4

    return (
      <Grid
        container
        spacing={ 24 }
        direction='row'
        className={ classes.container }
      >

      {
        status.phase == 'deployed' || status.phase == 'undeploying' ? (
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
                Resources
              </Typography>

              <ClusterResources
                info={ clusterInfo }
                phase={ status.phase }
                onOpenDashboard={ () => cluster.openDashboard() }
                onOpenMonitoring={ () => cluster.openMonitoring() }
                onOpenXoDemo={ () => cluster.openXoDemo() }
              />
            </Paper>
            
          </Grid>

        ) : null
      }

      {
        status.phase == 'created' ? (
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
                Deployment
              </Typography>

              <DeploymentSettings

              />

              
            </Paper>
            
          </Grid>

        ) : null
      }

      {
        SHOW_CONTENT_PHASES[status.phase] ? null : (
          <Grid
            item
            sm={12}
            md={8}
          >
        
            
          </Grid>
        )
      }


        <Grid
          item
          sm={12}
          md={infoGridWidth}
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

            <ClusterStatus
              cluster={ currentClusterData }
              onDeleteCluster={ () => cluster.deleteCluster(currentClusterData.settings.name) }
              onCleanupCluster={ () => cluster.cleanupCluster(currentClusterData.settings.name) }
              onDeployCluster={ () => cluster.deployCluster() }
              onUndeployCluster={ () => cluster.undeployCluster() }
            />
          </Paper>

          
          {
            clusterUtils.kubectlReady(currentClusterData.status.phase) ? (
              <Paper
                className={ classes.paper }
              >
                <Typography
                  variant='title'
                  className={ classes.title }
                >
                  Cluster Access
                </Typography>

                <ClusterAccess
                  downloadKubeConfig={ () => cluster.downloadKubeConfig() }
                  downloadKopsConfig={ () => cluster.downloadKopsConfig() }
                />

              </Paper>
            ) : null
          }
          
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