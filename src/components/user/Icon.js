import React from 'react'

import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Avatar from '@material-ui/core/Avatar'
import AccountCircle from '@material-ui/icons/AccountCircle'

import userUtils from 'utils/user'

const styles = (theme) => ({
  chip: {
    margin: theme.spacing.unit,
  },
})

class UserIcon extends React.Component {

  render() {
    const {
      user,
    } = this.props

    return user ? (
      <Avatar src={ userUtils.image(user) } />
    ) : (
      <AccountCircle />
    )
  }
}

UserIcon.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object,
}

export default withStyles(styles)(UserIcon)