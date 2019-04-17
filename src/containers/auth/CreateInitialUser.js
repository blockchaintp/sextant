import React from 'react'
import { connect } from 'react-redux'

import userActions from 'store/modules/user'

import UserForm from 'pages/auth/UserForm'
import selectors from '../../store/selectors'

@connect(
  state => ({
    error: '',
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