import React from 'react'
import { connect } from 'react-redux'

import authActions from 'store/modules/auth'

import Login from 'pages/auth/Login'
import selectors from '../../store/selectors';

const initialValues = {
  username: '',
  password: '',
}

@connect(
  state => ({
    error: selectors.auth.errors.login(state),
    loading: selectors.auth.loading.login(state),
    schema: selectors.config.forms.user.login(state),
    initialValues,
  }),
  {
    login: authActions.login,
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