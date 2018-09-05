import React from 'react'
import PropTypes from 'prop-types'
import { connectStore } from 'redux-box'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import { lighten } from '@material-ui/core/styles/colorManipulator'

import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

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
          xs={12}
          sm={4}
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

        <Grid
          item
          xs={12}
          sm={8}
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