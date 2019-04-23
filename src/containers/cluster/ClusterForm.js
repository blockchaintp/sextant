import React from 'react'
import { connect } from 'react-redux'

import routerActions from 'store/modules/router'
import userActions from 'store/modules/user'
import selectors from 'store/selectors'

import UserForm from 'pages/user/UserForm'
import Loading from 'components/system/Loading'

const newInitialValues = {
  username: '',
  permission: 'user',
  password: '',
  confirmPassword: '', 
}

const onCancel = () => routerActions.navigateTo('clusters')

@connect(
  state => {

    const routeParams = selectors.router.params(state)

    const {
      id,
      type,
    } = routeParams

    return {
      error: selectors.cluster.errors.form(state),
      submitting: selectors.cluster.loading.form(state),
      loading: selectors.cluster.loading.get(state),
      id,
      type,
    }
  },
  {
    //submitForm: userActions.submitForm,
    onCancel, 
  },
)
class ClusterFormContainer extends React.Component {

  render() {

    console.log('--------------------------------------------')
    console.dir(this.props)

    return null 
  }
}

export default ClusterFormContainer