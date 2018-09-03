import React from 'react'
import PropTypes from 'prop-types'
import { connectStore } from 'redux-box'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import { lighten } from '@material-ui/core/styles/colorManipulator'
import { reduxForm, Field } from 'redux-form'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import settings from '../settings'
import store from '../store'
import configModule from '../store/config'
import clusterModule from '../store/cluster'

import withRouter from '../utils/withRouter'

import ClusterForm from '../components/ClusterForm'

const styles = theme => {
  return {
    container: {
      marginTop: theme.spacing.unit * 2,
      padding: theme.spacing.unit * 2,
    },
    paper: {
      padding: theme.spacing.unit * 2,
    }
  }
}

@reduxForm({
  form: 'clusterForm',
  initialValues: {
    
  }
})
@connectStore({
  config: configModule,
  cluster: clusterModule,
})
@connect(
  (state, ownProps) => {
    return {
      formValues: state.form.clusterForm.values,
    }
  },
  (dispatch) => {
    return {
      
    }
  }
)
class ClusterAddNew extends React.Component {
  
  render() {
    const { classes, cluster, config } = this.props
    const awsRegions = config.values.awsRegions || []

    return (
      <Grid
        container
        direction='row'
        justify='center'
        alignItems='center'
        className={ classes.container }
      >
        <Grid
          item
          xs={8}
        >
          <Paper
            className={ classes.paper }
          >
            <Typography
              variant='title'
            >
              New Cluster
            </Typography>
            <ClusterForm
              awsRegions={ awsRegions }
            />
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