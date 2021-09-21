/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
import React from 'react'
import { connect } from 'react-redux'

import routerActions from 'store/modules/router'
import clusterActions from 'store/modules/cluster'
import userActions from 'store/modules/user'
import snackbarActions from 'store/modules/snackbar'
import selectors from 'store/selectors'

import ClusterForm from 'pages/cluster/ClusterForm'
import Loading from 'components/system/Loading'

const clusterInitialValues = {
  local: {
    name: '',
    provision_type: 'local',
    desired_state: {},
  },
  remote: {
    name: '',
    provision_type: 'remote',
    desired_state: {
      apiServer: '',
      token: '',
      ca: '',
    },
  },
}

const onCancel = () => routerActions.navigateTo('clusters')
const clearAccessControlResults = () => userActions.setAccessControlResults([])

@connect(
  (state) => {
    const routeParams = selectors.router.params(state)

    const {
      id,
      provision_type,
    } = routeParams

    const clusterForms = selectors.config.forms.cluster(state)

    const initialValues = id === 'new'
      ? clusterInitialValues[provision_type]
      : JSON.parse(JSON.stringify(selectors.cluster.collection.item(state) || {}))

    const schema = id === 'new'
      ? clusterForms[provision_type].add
      : (
        initialValues.provision_type
          ? clusterForms[initialValues.provision_type].edit
          : []
      )

    return {
      id,
      error: selectors.cluster.errors.form(state),
      submitting: selectors.cluster.loading.form(state),
      loading: selectors.cluster.loading.get(state),
      schema,
      initialValues,
      provision_type: initialValues ? initialValues.provision_type : null,
      tasks: selectors.cluster.taskCollection.list(state),
      roles: selectors.cluster.roleCollection.list(state),
      accessControlFormOpen: selectors.user.accessControlFormOpen(state),
      accessControlLevel: selectors.user.accessControlLevel(state),
      accessControlSearch: selectors.user.accessControlSearch(state),
      accessControlUsers: selectors.user.accessControlResults(state),
      userList: selectors.user.collection.list(state),
    }
  },
  {
    submitForm: clusterActions.submitForm,
    snackbarMessage: snackbarActions.setInfo,
    setAccessControlFormOpen: userActions.setAccessControlFormOpen,
    setAccessControlLevel: userActions.setAccessControlLevel,
    setAccessControlSearch: userActions.setAccessControlSearch,
    loadAccessControlResults: userActions.loadAccessControlResults,
    clearAccessControlResults,
    addRole: clusterActions.addRole,
    editRole: clusterActions.editRole,
    deleteRole: clusterActions.deleteRole,
    onCancelRoleForm: userActions.closeAccessControlForm,
    onCancel,
  },
)
class ClusterFormContainer extends React.Component {
  render() {
    const {
      loading,
    } = this.props

    if (loading) {
      return <Loading />
    }

    return (
      <ClusterForm
        {...this.props}
      />
    )
  }
}

export default ClusterFormContainer
