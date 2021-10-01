import React from 'react'

import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles';

import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'

import settings from 'settings'

const UserIcon = settings.icons.user

const styles = (theme) => ({
  chip: {
    cursor: 'pointer',
    margin: theme.spacing(1),
  },
  chipAvatar: {
    color: theme.palette.primary.main,
    backgroundColor: [theme.palette.getContrastText(theme.palette.primary.main), '!important'],
  },
  chipLabel: {
    color: theme.palette.getContrastText(theme.palette.primary.main),
    textTransform: ['none', '!important'],
  },
  chipOutline: {
    borderColor: [theme.palette.getContrastText(theme.palette.primary.main), '!important'],
  },
})

class UserAvatar extends React.Component {
  render() {
    const {
      classes,
      user,
    } = this.props

    return (
      <Chip
        variant="outlined"
        avatar={(
          <Avatar className={classes.bigAvatar}>
            <UserIcon />
          </Avatar>
        )}
        label={user.username}
        className={classes.chip}
        classes={{
          outlined: classes.chipOutline,
          label: classes.chipLabel,
          avatar: classes.chipAvatar,
        }}
      />
    )
  }
}

UserAvatar.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(UserAvatar)
