import React from 'react'
import PropTypes from 'prop-types'
import { connectStore } from 'redux-box'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import { lighten } from '@material-ui/core/styles/colorManipulator'
import { reduxForm, Field } from 'redux-form'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import settings from '../settings'
import store from '../store'
import configModule from '../store/config'
import clusterModule from '../store/cluster'

import withRouter from '../utils/withRouter'

import Loading from '../components/Loading'
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
      formValues: (state.form.clusterForm || {}).values || {},
    }
  },
  (dispatch) => {
    return {
      
    }
  }
)
class ClusterAddNew extends React.Component {
  
  componentDidMount(){
    const { config } = this.props
    config.loadAws()
  }

  getRequireDomain() {
    const { config } = this.props
    return (
      <div>
        <Typography
          variant='title'
        >
          Route53 Domain Needed
        </Typography>
        <Typography
          variant='body1'
        >
          <br />

          To create a new cluster, you need to create a domain managed by Route53. <br /><br />

          Click <strong><a href="https://console.aws.amazon.com/route53/home" target="_blank">here</a></strong> or open the AWS console and create a Route53 domain to proceed.<br /><br />

          Once you have created a domain - click the button below to reload this page. <br /><br />
        </Typography>
        <Button
          color="primary"
          variant="outlined"
          onClick={ () => config.loadAws() }
        >
          Reload Page
        </Button>
      </div>
    )
  }

  getAWSForm() {
    const { config, cluster } = this.props
    const awsConfig = config.aws
    return (
      <div>
        <Typography
          variant='title'
        >
          New Cluster
        </Typography>
        <ClusterForm
          awsConfig={ awsConfig }
          saveTitle='Create Cluster'
          submitting={ cluster.submitting }
          onSubmit={ () => cluster.submitAddForm() }
          onCancel={ () => cluster.viewList() }
        />
      </div>
    )
  }

  getLoading() {
    return (
      <Loading />
    )
  }

  getContent() {
    const { config } = this.props

    const awsLoading = config.awsLoading
    const awsConfig = config.aws
    const awsDomains = awsConfig.domains || []

    if(awsLoading) return this.getLoading()
    if(awsDomains.length <= 0) return this.getRequireDomain()
    return this.getAWSForm()
  }

  render() {
    const { classes } = this.props

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
            { this.getContent() }
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