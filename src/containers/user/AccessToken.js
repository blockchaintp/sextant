import React from 'react'
import { connect } from 'react-redux'

import userActions from 'store/modules/user'
import snackbarActions from 'store/modules/snackbar'
import selectors from 'store/selectors'

import Loading from 'components/system/Loading'
import AccessToken from 'pages/user/AccessToken'

@connect(
  state => {
    return {
      loading: selectors.user.loading.getAccessToken(state),
      submitting: selectors.user.loading.refreshAccessToken(state),
      accessToken: selectors.user.accessToken(state),
    }
  },
  {
    refreshToken: userActions.refreshAccessToken,
    snackbarMessage: snackbarActions.setInfo,
  },
)
class AccessTokenContainer extends React.Component {

  render() {
    const {
      loading,
    } = this.props
    if(loading) return <Loading />
    return (
      <AccessToken 
        {...this.props}
      />
    )
  }
}

export default AccessTokenContainer