import React from 'react'
import { connect } from 'react-redux'

import routerActions from 'store/modules/router'
import userActions from 'store/modules/user'

import UserTable from 'pages/user/UserTable'
import selectors from 'store/selectors'

const onAdd = () => routerActions.navigateTo('user', { id: 'new' })
const onEdit = (id) => routerActions.navigateTo('user', { id })
const onDelete = (id) => userActions.delete(id)

@connect(
  state => ({
    users: selectors.user.collection.list(state),
    isSuperuser: selectors.auth.isSuperuser(state)
  }),
  {
    onAdd,
    onEdit,
    onDelete,
  },
)
class UserTableContainer extends React.Component {

  render() {
    return (
      <UserTable {...this.props} />
    )    
  }
}

export default UserTableContainer