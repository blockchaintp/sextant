import React from 'react'
import { connect } from 'react-redux'

import userActions from 'store/modules/user'
import selectors from 'store/selectors'

import RoleUserAutoSuggest from 'pages/role/RoleUserAutoSuggest'

const clearUsers = () => userActions.setAccessControlResults([])

@connect(
  state => {
    return {
      search: selectors.user.accessControlSearch(state),
      users: selectors.user.accessControlResults(state),
    }
  },
  {
    setSearch: userActions.setAccessControlSearch,
    loadUsers: userActions.loadAccessControlResults,
    clearUsers,
  },
)
class RoleUserAutoSuggestContainer extends React.Component {

  render() {
    return (
      <RoleUserAutoSuggest 
        {...this.props}
      />
    )
  }
}

export default RoleUserAutoSuggestContainer