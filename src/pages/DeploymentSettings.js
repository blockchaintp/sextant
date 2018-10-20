import React from 'react'
import PropTypes from 'prop-types'
import { connectStore } from 'redux-box'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import { lighten } from '@material-ui/core/styles/colorManipulator'
import { reduxForm, Field, getFormSyncErrors } from 'redux-form'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import settings from '../settings'
import configModule from '../store/config'
import clusterModule from '../store/cluster'
import selectors from '../store/selectors'

import withRouter from '../utils/withRouter'
import validators from '../utils/validators'

import Loading from '../components/Loading'
import DeploymentForm from '../components/DeploymentForm'

const styles = theme => {
  return {
    
  }
}

const TEST_DATA = {
  network_name: 'sawtooth',
  dynamic_peering: 'true',
  poet_enabled: 'false',
  rbac_enabled: 'true',
  rbac_secret_key: 'g7op0ioXPdw7jFTf4aY2',
  rbac_aes_key: '37960e8f0337b90131acfb30b8817d17',
  rbac_batcher_key: 'a8fbe6bb38fb6ae5cc1abbfee9068f734b4c023cc5ffc193a8c9d83793d0ee02',
  xo_enabled: 'true',
  smallbank_enabled: 'true',
  simple_enabled: 'true',
}

const DEFAULT_DATA = {
  network_name: 'sawtooth',
  dynamic_peering: 'true',
  poet_enabled: 'true',
  rbac_enabled: 'true',
  rbac_secret_key: '',
  rbac_aes_key: '',
  rbac_batcher_key: '',
  xo_enabled: 'true',
  smallbank_enabled: 'true',
  simple_enabled: 'true',
}

@reduxForm({
  form: 'deploymentForm',
  initialValues: TEST_DATA,
  validate: validators.deployment.all,
})
@connectStore({
  config: configModule,
  cluster: clusterModule,
})
@connect(
  (state, ownProps) => {

    const formValues = selectors.form.values(state, 'deploymentForm')
    const formErrors = selectors.form.errorMessages(state, 'deploymentForm')

    return {
      formValues,
      syncFormErrors: formErrors,
      rawFormErrors: getFormSyncErrors('deploymentForm')(state),
    }
  },
  (dispatch) => {
    return {
      
    }
  }
)
class DeploymentSettings extends React.Component {
  
  componentDidMount(){
    const { config, cluster } = this.props
    cluster.resetForm()
  }

  render() {
    const { 
      classes,
      syncFormErrors,
      cluster,
      formValues,
      rawFormErrors,
    } = this.props

    const showSyncFormErrors = cluster.showSyncFormErrors
    const asyncFormError = cluster.asyncFormError

    return (
      <DeploymentForm
        formValues={ formValues }
        saveTitle='Deploy Sawtooth'
        submitting={ cluster.submitting }
        error={ cluster.formError }
        syncFormErrors={ syncFormErrors }
        showSyncFormErrors={ showSyncFormErrors }
        rawFormErrors={ rawFormErrors }
        asyncFormError={ asyncFormError }
        onSubmit={ () => cluster.submitDeployForm() }
        onCancel={ () => cluster.viewList() }
      />
    )
  }
}

DeploymentSettings.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DeploymentSettings)