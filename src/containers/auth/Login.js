import React from 'react'
import { connect } from 'react-redux'

import userActions from 'store/modules/user'

import Login from 'pages/auth/Login'
import selectors from '../../store/selectors';

const initialValues = {
  username: '',
  password: '',
}

@connect(
  state => ({
    error: selectors.user.errors.login(state),
    loading: selectors.user.loading.create(state),
    schema: selectors.config.forms.user.login(state),
    initialValues,
  }),
  {
    login: userActions.login,
  },
)
class LoginContainer extends React.Component {

  render() {
    return (
      <Login {...this.props} />
    )    
  }
}

export default LoginContainer