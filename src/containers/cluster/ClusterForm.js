import React from 'react'
import { connect } from 'react-redux'

import routerActions from 'store/modules/router'
import clusterActions from 'store/modules/cluster'
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

@connect(
  state => {

    const routeParams = selectors.router.params(state)

    const {
      id,
      provision_type,
    } = routeParams

    const clusterForms = selectors.config.forms.cluster(state)

    const initialValues = id == 'new' ?
      clusterInitialValues[provision_type] :
      selectors.cluster.collection.item(state) || {}

    const schema = id == 'new' ?
      clusterForms[provision_type].add :
      (
        initialValues.provision_type ?
        clusterForms[initialValues.provision_type].edit :
        []
      )

    return {
      id,
      error: selectors.cluster.errors.form(state),
      submitting: selectors.cluster.loading.form(state),
      loading: selectors.cluster.loading.get(state),
      schema: schema,
      initialValues,
      provision_type: initialValues ? initialValues.provision_type : null,
      tasks: selectors.cluster.taskCollection.list(state),
    }
  },
  {
    submitForm: clusterActions.submitForm,
    onCancel, 
  },
)
class ClusterFormContainer extends React.Component {

  render() {
    const {
      loading,
    } = this.props

    if(loading) {
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