import React from 'react'
import { connect } from 'react-redux'

import routerActions from 'store/modules/router'
import userActions from 'store/modules/user'
import selectors from 'store/selectors'

import UserForm from 'pages/user/UserForm'

const onCancel = () => routerActions.navigateTo('home')

@connect(
  state => {
    return {
      error: selectors.user.errors.form(state),
      submitting: selectors.user.loading.form(state),
      schema: selectors.config.forms.user.userSelf(state),
      initialValues: selectors.auth.data(state),
    }
  },
  {
    submitForm: userActions.saveAccountDetails,
    onCancel, 
  },
)
class AccountDetailsContainer extends React.Component {

  render() {
    return (
      <UserForm {...this.props} />
    )    
  }
}

export default AccountDetailsContainer