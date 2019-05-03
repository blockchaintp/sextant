import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import ErrorIcon from '@material-ui/icons/Error'
import DoneIcon from '@material-ui/icons/Done'

import green from '@material-ui/core/colors/green'

const styles = theme => ({
  spinner: {
    width: ['16px', '!important'],
    height: ['16px', '!important'],
  },
  success: {
    color: green[600],
  },
  error: {
    color: theme.palette.error.dark,
  },
})

class StatusIcon extends React.Component {

  render() {
    const {
      classes,
      status,
    } = this.props

    if(status == 'running' || status == 'created') {
      return (
        <CircularProgress
          className={ classes.spinner }
        />
      )
    }
    else if(status == 'error') {
      return (
        <ErrorIcon
          className={ classes.error }
        />
      )
    }
    else if(status == 'finished') {
      return (
        <DoneIcon
          className={ classes.success }
        />
      )
    }
    else {
      return null
    }
  }
}

StatusIcon.propTypes = {
  classes: PropTypes.object.isRequired,
  status: PropTypes.oneOf(['created', 'running', 'finished', 'error']).isRequired,
}

export default withStyles(styles)(StatusIcon)