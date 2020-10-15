import React from 'react'
import { connect } from 'react-redux'

import userActions from 'store/modules/user'

import UserForm from 'pages/user/UserForm'
import selectors from 'store/selectors'

import {
  initialUserForm,
} from '../../forms'

const initialValues = {
  username: '',
  permission: 'superuser',
  password: '',
  confirmPassword: '', 
}

@connect(
  state => ({
    error: selectors.user.errors.form(state),
    loading: selectors.user.loading.form(state),
    schema: initialUserForm,
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