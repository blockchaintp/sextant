import React from 'react'
import { connect } from 'react-redux'

import userActions from 'store/modules/user'

import UserForm from 'pages/auth/UserForm'
import selectors from '../../store/selectors'

const initialValues = {
  username: '',
  permission: 'superuser',
  password: '',
  confirmPassword: '', 
}

@connect(
  state => ({
    error: selectors.user.errors.create(state),
    loading: selectors.user.loading.create(state),
    schema: selectors.config.forms.user.initialUser(state),
    initialValues,
  }),
  {
    submitForm: userActions.createInitial,
  },
)
class CreateInitialUserContainer extends React.Component {

  render() {
    return (
      <UserForm {...this.props} />
    )    
  }
}

export default CreateInitialUserContainer