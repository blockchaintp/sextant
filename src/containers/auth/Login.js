import React from 'react'
import { connect } from 'react-redux'

import authActions from 'store/modules/auth'

import Login from 'pages/auth/Login'
import selectors from 'store/selectors'

import {
  loginForm,
} from '../../forms'

const initialValues = {
  username: '',
  password: '',
}

@connect(
  state => ({
    error: selectors.auth.errors.login(state),
    loading: selectors.auth.loading.login(state),
    schema: loginForm,
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