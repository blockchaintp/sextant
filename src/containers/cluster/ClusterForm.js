import React from 'react'
import { connect } from 'react-redux'

import routerActions from 'store/modules/router'
import clusterActions from 'store/modules/cluster'
import selectors from 'store/selectors'

import ClusterForm from 'pages/cluster/ClusterForm'
import Loading from 'components/system/Loading'

const initialValues = {
  local: {
    name: '',
  },
  remote: {
    name: '',
    connection: '',
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

    const baseProps = {
      error: selectors.cluster.errors.form(state),
      submitting: selectors.cluster.loading.form(state),
      loading: selectors.cluster.loading.get(state),
      id,
    }

    if(id == 'new') {
      baseProps.provision_type = provision_type
      baseProps.initialValues = initialValues[provision_type]
      baseProps.schema = selectors.config.forms.cluster[provision_type](state)
    }

    return baseProps
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
      <ClusterForm {...this.props} />
    )
  }
}

export default ClusterFormContainer