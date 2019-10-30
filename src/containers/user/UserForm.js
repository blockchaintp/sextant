import React from 'react'
import { connect } from 'react-redux'

import routerActions from 'store/modules/router'
import userActions from 'store/modules/user'
import selectors from 'store/selectors'

import UserForm from 'pages/user/UserForm'
import Loading from 'components/system/Loading'
import { Typography } from '@material-ui/core'

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
    const userData = selectors.auth.data(state)

    const schema = id == 'new' ?
      selectors.config.forms.user.userAdd(state) :
      (
        id == userData.id ?
        selectors.config.forms.user.userSelf(state) :
        selectors.config.forms.user.userEdit(state)
      )

    const initialValues = id == 'new' ?
      newInitialValues :
      selectors.user.collection.item(state)

    return {
      error: selectors.user.errors.form(state),
      submitting: selectors.user.loading.form(state),
      loading: selectors.user.loading.get(state),
      schema,
      initialValues,
      dbId: id
    }
  },
  {
    submitForm: userActions.submitForm,
    onCancel, 
  },
)
class CreateInitialUserContainer extends React.Component {

  render() {

    const {
      loading,
    } = this.props
    
    if(loading) {
      return <Loading />
    }
    
    return (
      <UserForm {...this.props} />
    )    
  }
}

export default CreateInitialUserContainer