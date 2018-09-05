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
import configModule from '../store/config'
import clusterModule from '../store/cluster'
import selectors from '../store/selectors'

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
    },
  }
}

const TEST_DATA = {
  domain: "dev.catenasys.com.",
  master_count: 1,
  master_size: "m1.medium",
  master_zones: ["eu-west-2a"],
  name: "apples",
  node_count: 3,
  node_size: "m1.medium",
  node_zones: ["eu-west-2a"],
  region: "eu-west-2",
  topology: "public",
  public_key: "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDuH98uo8PkAhfRqcozlSqZ9AFKyW7YGOQ2yIo4XaQcFQDjWzJ/qPYcq3n0pKdXixtldavZJqDHhdtZ4rdbP02YQKO6PGPkvO7roOekSAu472b6xt+eT9Phgf8mGUrV14DME18zeOHZdm8qax33L86zpgsmfYwUh0Fm4z4F31791xhIXHgWnU/oOtDKn8YNyOGrrp1usibMS6KYslW7KK0aIHH0ww54aen08GkL9Lxhc+W5rLbJy77J7CttW3mPO03KAmuy1INcjKvnvPLO1rhOiAKNObd/z4FVExadGGfeNffvo+oeMeZcDvPVh3G/xLAi2oPgcsnlozPMNWhigZdf root@47b105f7d6df"
}

const DEFAULT_DATA = {
  master_zones: [],
  node_zones: [],
  topology: 'public',
  master_count: 1,
  node_count: 3,
}

@reduxForm({
  form: 'clusterForm',
  initialValues: TEST_DATA,
})
@connectStore({
  config: configModule,
  cluster: clusterModule,
})
@connect(
  (state, ownProps) => {

    const formValues = selectors.form.values(state, 'clusterForm')
    const formErrors = selectors.form.errorMessages(state, 'clusterForm')
    const awsZones = selectors.aws.zones(state, formValues.region)

    return {
      formValues,
      syncFormErrors: formErrors,
      awsZones,
    }
  },
  (dispatch) => {
    return {
      
    }
  }
)
class ClusterAddNew extends React.Component {
  
  componentDidMount(){
    const { config, cluster } = this.props
    config.loadAws()
    cluster.resetForm()
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
    const awsZones = this.props.awsZones
    const formValues = this.props.formValues
    const syncFormErrors = this.props.syncFormErrors
    const showSyncFormErrors = cluster.showSyncFormErrors
    const asyncFormError = cluster.asyncFormError

    return (
      <div>
        <Typography
          variant='title'
        >
          New Cluster
        </Typography>
        <ClusterForm
          awsConfig={ awsConfig }
          awsZones={ awsZones }
          formValues={ formValues }
          saveTitle='Create Cluster'
          submitting={ cluster.submitting }
          error={ cluster.formError }
          syncFormErrors={ syncFormErrors }
          showSyncFormErrors={ showSyncFormErrors }
          asyncFormError={ asyncFormError }
          onSubmit={ () => cluster.submitAddForm() }
          onCancel={ () => cluster.viewList() }
          onRegionChange={ () => cluster.regionChanged() }
          privateKeyWindowOpen={ cluster.keypairWindowOpen }
          privateKeyValue={ cluster.keypairPrivateKey }
          onCreatePrivateKeypair={ () => cluster.createKeypair() }
          onPrivateKeyCopied={ () => cluster.privateKeyCopied() }
          onPrivateKeyWindowClosed={ () => cluster.closeKeypairWindow() }
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