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

            <ClusterStatus
              cluster={ currentClusterData }
              onDeleteCluster={ () => cluster.deleteCluster(currentClusterData.settings.name) }
              onCleanupCluster={ () => cluster.cleanupCluster(currentClusterData.settings.name) }
            />
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

                <div>
                  <Button 
                    className={ classes.button }
                    color="primary" 
                    variant="raised"
                    size="small"
                    autoFocus
                    onClick={ () => cluster.downloadKubeConfig() }
                  >
                    Download Kube Config
                  </Button>
                  <Button 
                    className={ classes.button }
                    color="primary" 
                    variant="raised"
                    size="small"
                    autoFocus
                    onClick={ () => cluster.downloadKopsConfig() }
                  >
                    Download Kops Config
                  </Button>
                </div>
              </Paper>
            ) : null
          }
        </Grid>

      </Grid>
    )
  }
}

ClusterView.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(ClusterView)