import React from 'react'
import { connect } from 'react-redux'

import routerActions from 'store/modules/router'
import userActions from 'store/modules/user'

import UserForm from 'pages/user/UserForm'
import selectors from 'store/selectors'

const newInitialValues = {
  username: '',
  permission: 'user',
  password: '',
  confirmPassword: '', 
}

const onCancel = () => routerActions.navigateTo('users')

@connect(
  state => {
    const id = selectors.router.idParam(state)

    const schema = id == 'new' ?
      selectors.config.forms.user.userAdd(state) :
      selectors.config.forms.user.userEdit(state)

    const initialValues = id == 'new' ?
      newInitialValues :
      selectors.user.collection.item(state)

    return {
      error: selectors.user.errors.form(state),
      loading: selectors.user.loading.form(state),
      schema,
      initialValues,
      showCancelButton: true,
    }
  },
  {
    submitForm: userActions.submitForm,
    onCancel, 
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