import React from 'react'
import { connect } from 'react-redux'

import routerActions from 'store/modules/router'
import clusterActions from 'store/modules/cluster'
import selectors from 'store/selectors'

import ClusterForm from 'pages/cluster/ClusterForm'
import Loading from 'components/system/Loading'

const REQUIRED_CONNECTION_FIELDS = ['apiServer', 'token', 'ca']
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
      loadingError: selectors.cluster.errors.get(state),
      id,
    }

    if(id == 'new') {
      baseProps.initialValues = initialValues[provision_type]
      baseProps.schema = selectors.config.forms.cluster[provision_type](state)
    }
    else if(!baseProps.loading && !baseProps.loadingError) {
      baseProps.initialValues = selectors.user.collection.item(state)
      baseProps.schema = selectors.config.forms.cluster[baseProps.initialValues.provision_type](state)
    }

    return baseProps
  },
  {
    submitForm: clusterActions.submitForm,
    onCancel, 
  },
)
class ClusterFormContainer extends React.Component {

  validate(values) {
    const errors = {}
    if(values.connection) {
      try {
        const data = JSON.parse(values.connection)
        REQUIRED_CONNECTION_FIELDS.forEach(field => {
          if(!data[field]) {
            errors.connection = `${field} field is needed in connection JSON`
          }
        })        
      }
      catch(err) {
        errors.connection = `invalid JSON: ${err.toString()}`
      }
    }
    return errors
  }

  render() {

    const {
      loading,
      loadingError,
    } = this.props

    if(loading) {
      return <Loading />
    }

    if(loadingError) {
      return null
    }

    return (
      <ClusterForm 
        validate={ this.validate }
        {...this.props}
      />
    )
  }
}

export default ClusterFormContainer