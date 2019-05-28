import React from 'react'
import { connect } from 'react-redux'

import routerActions from 'store/modules/router'
import deploymentActions from 'store/modules/deployment'
import userActions from 'store/modules/user'
import selectors from 'store/selectors'

import DeploymentForm from 'pages/deployment/DeploymentForm'
import Loading from 'components/system/Loading'

const onCancel = (cluster) => routerActions.navigateTo('deployments', {cluster})
const clearAccessControlResults = () => userActions.setAccessControlResults([])

@connect(
  state => {

    const routeParams = selectors.router.params(state)

    const {
      id,
      deployment_type,
      deployment_version,
    } = routeParams

    const deploymentForms = selectors.config.forms.deployment(state)
    let initialValues = {}
    let schema = []

    // we are creating a new deployment
    if(id == 'new') {
      schema = deploymentForms[deployment_type].forms[deployment_version]
    }
    // it's an existing deployment
    else {
      const existingValues = selectors.deployment.collection.item(state)

      if(existingValues) {
        initialValues = existingValues.desired_state
        schema = deploymentForms[existingValues.deployment_type].forms[existingValues.deployment_version]
      }
    }

    return {
      id,
      exists: id == 'new' ? false : true,
      clusterId: state.router.route.params.cluster,
      error: selectors.deployment.errors.form(state),
      submitting: selectors.deployment.loading.form(state),
      loading: selectors.deployment.loading.get(state),
      schema,
      initialValues,
      deployment_type: initialValues ? initialValues.deployment_type : null,
      tasks: selectors.deployment.taskCollection.list(state),
      roles: selectors.deployment.roleCollection.list(state),
      accessControlFormOpen: selectors.user.accessControlFormOpen(state),
      accessControlLevel: selectors.user.accessControlLevel(state),
      accessControlSearch: selectors.user.accessControlSearch(state),
      accessControlUsers: selectors.user.accessControlResults(state),
    }
  },
  {
    submitForm: deploymentActions.submitForm,
    onCancel, 
    setAccessControlFormOpen: userActions.setAccessControlFormOpen,
    setAccessControlLevel: userActions.setAccessControlLevel,
    setAccessControlSearch: userActions.setAccessControlSearch,
    loadAccessControlResults: userActions.loadAccessControlResults,
    clearAccessControlResults,
    addRole: deploymentActions.addRole,
    deleteRole: deploymentActions.deleteRole,
    onCancelRoleForm: userActions.closeAccessControlForm,
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