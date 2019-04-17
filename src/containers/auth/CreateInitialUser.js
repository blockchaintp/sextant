import React from 'react'
import { connect } from 'react-redux'

import userActions from 'store/modules/user'

import UserForm from 'pages/auth/UserForm'
import selectors from '../../store/selectors'

const initialValues = {
  username: '',
  accessLevel: 'superuser',
  password: '',
  confirmPassword: '', 
}

@connect(
  state => ({
    error: '',
    schema: selectors.config.forms.user.initialUser(state),
    initialValues,
  }),
  {
    submitForm: () => {},
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