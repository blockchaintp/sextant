import React from 'react'
import { connect } from 'react-redux'

import userActions from 'store/modules/user'

import Login from 'pages/auth/Login'
import selectors from '../../store/selectors';

@connect(
  state => ({
    error: selectors.user.errors.login(state),
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