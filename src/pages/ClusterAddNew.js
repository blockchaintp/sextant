import React from 'react'
import PropTypes from 'prop-types'
import { connectStore } from 'redux-box'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import { lighten } from '@material-ui/core/styles/colorManipulator'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

import settings from '../settings'
import store from '../store'
import clusterModule from '../store/cluster'

import withRouter from '../utils/withRouter'

const styles = theme => {
  return {
    
  }

}

@connectStore({
  cluster: clusterModule,
})
class ClusterAddNew extends React.Component {
  
  render() {
    const { classes, cluster } = this.props

    return (
      <Grid
        container
      >
        <Grid
          item
        >
          <Paper>
            Form2
          </Paper>

        </Grid>
      </Grid>
    )
  }
}

ClusterAddNew.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ClusterAddNew)