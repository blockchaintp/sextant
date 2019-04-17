import React from 'react'

import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Avatar from '@material-ui/core/Avatar'
import Chip from '@material-ui/core/Chip'
import AccountCircle from '@material-ui/icons/AccountCircle'

import Typography from '@material-ui/core/Typography'
import userUtils from 'utils/user'

import Icon from './Icon'

const styles = (theme) => {
  return {
    chip: {
      cursor: 'pointer',
      margin: theme.spacing.unit,
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
  }
}

class UserAvatar extends React.Component {

  render() {
    const {
      classes,
      user,
    } = this.props

    return (
      <Chip
        variant="outlined"
        avatar={
          <Avatar className={ classes.bigAvatar }>
            <AccountCircle />
          </Avatar>
        }
        label={ user.username }
        className={ classes.chip }
        classes={{
          outlined: classes.chipOutline,
          label: classes.chipLabel,
          avatar: classes.chipAvatar,
        }}
      />
    )
/*
    const name = user && !noName ? (
      <Typography 
        variant="body1" 
        color="inherit" 
        className={ classes.avatarName }
      >
        { user.username }
      </Typography>
    ) : null

    const icon = noIcon ? null : (
      <Icon 
        userData={ user }
      />
    )

    if(this.props.iconAlign == 'left') {
      return (
        <div className={ classes.avatarWrapper }>
          { icon }
          { name }
        </div>
      )
    }
    else {
      return (
        <div className={ classes.avatarWrapper }>
          { name }
          { icon }
        </div>
      )
    }    
     */
  }
 
}

UserAvatar.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(UserAvatar)