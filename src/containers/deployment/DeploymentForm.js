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
  },
  ethereum: {
    name: '',
  },
}

const onCancel = () => routerActions.navigateTo('deployments')

@connect(
  state => {

    const routeParams = selectors.router.params(state)

    const {
      id,
      deployment_type,
    } = routeParams

    const deploymentForms = selectors.config.forms.deployment(state)

    const initialValues = id == 'new' ?
      clusterInitialValues[provision_type] :
      selectors.cluster.collection.item(state) || {}

    const schema = id == 'new' ?
      deploymentInitialValues[deployment_type].add :
      (
        initialValues.deployment_type ?
        deploymentForms[initialValues.deployment_type].edit :
        []
      )

    return {
      id,
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