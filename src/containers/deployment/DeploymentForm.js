import React from 'react'
import { connect } from 'react-redux'

import routerActions from 'store/modules/router'
import deploymentActions from 'store/modules/deployment'
import selectors from 'store/selectors'

import DeploymentForm from 'pages/deployment/DeploymentForm'
import Loading from 'components/system/Loading'

const onCancel = (cluster) => routerActions.navigateTo('deployments', {cluster})

@connect(
  state => {

    const routeParams = selectors.router.params(state)

    const {
      id,
      deployment_type,
      deployment_version,
    } = routeParams

    const deploymentForms = selectors.config.forms.deployment(state)
    const deploymentForm = deploymentForms[deployment_type].forms[deployment_version]

    const initialValues = id == 'new' ?
      {} :
      selectors.deployment.collection.item(state) || {}

    const schema = id == 'new' ?
      deploymentForm :
      (
        initialValues.deployment_type && initialValues.deployment_version ?
        deploymentForms[initialValues.deployment_type][initialValues.deployment_version] :
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