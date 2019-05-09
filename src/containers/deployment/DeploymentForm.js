import React from 'react'
import { connect } from 'react-redux'

import routerActions from 'store/modules/router'
import deploymentActions from 'store/modules/deployment'
import selectors from 'store/selectors'

import DeploymentForm from 'pages/deployment/DeploymentForm'
import Loading from 'components/system/Loading'

const deploymentInitialValues = {
  sawtooth: {
    name: '',
    deployment_type: 'sawtooth',
    desired_state: {},
  },
  ethereum: {
    name: '',
    deployment_type: 'ethereum',
    desired_state: {},
  },
}

const onCancel = (cluster) => routerActions.navigateTo('deployments', {cluster})

@connect(
  state => {

    const routeParams = selectors.router.params(state)

    const {
      id,
      deployment_type,
    } = routeParams

    const deploymentForms = selectors.config.forms.deployment(state)

    const initialValues = id == 'new' ?
      deploymentInitialValues[deployment_type] :
      selectors.deployment.collection.item(state) || {}

    const schema = id == 'new' ?
      deploymentForms[deployment_type].add :
      (
        initialValues.deployment_type ?
        deploymentForms[initialValues.deployment_type].edit :
        []
      )

    return {
      id,
      clusterId: state.router.route.params.cluster,
      error: selectors.deployment.errors.form(state),
      submitting: selectors.deployment.loading.form(state),
      loading: selectors.deployment.loading.get(state),
      schema: schema,
      initialValues,
      deployment_type: initialValues ? initialValues.deployment_type : null,
      tasks: selectors.deployment.taskCollection.list(state),
    }
  },
  {
    submitForm: deploymentActions.submitForm,
    onCancel, 
  },
)
class DeploymentFormContainer extends React.Component {

  render() {
    const {
      loading,
    } = this.props

    if(loading) {
      return <Loading />
    }

    return (
      <DeploymentForm 
        {...this.props}
      />
    )
  }
}

export default DeploymentFormContainer