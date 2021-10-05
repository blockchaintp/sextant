import React from 'react'
import PropTypes from 'prop-types'

import withStyles from '@mui/styles/withStyles';
import CircularProgress from '@mui/material/CircularProgress'
import ErrorIcon from '@mui/icons-material/Error'
import DoneIcon from '@mui/icons-material/Done'

import { green } from '@mui/material/colors'

const styles = (theme) => ({
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

class TaskStatusIcon extends React.Component {
  render() {
    const {
      classes,
      status,
    } = this.props

    if (status === 'running' || status === 'created') {
      return (
        <CircularProgress
          className={classes.spinner}
        />
      )
    }
    if (status === 'error') {
      return (
        <ErrorIcon
          className={classes.error}
        />
      )
    }
    if (status === 'finished') {
      return (
        <DoneIcon
          className={classes.success}
        />
      )
    }
    return null
  }
}

TaskStatusIcon.propTypes = {
  classes: PropTypes.object.isRequired,
  status: PropTypes.oneOf(['created', 'running', 'finished', 'error']).isRequired,
}

export default withStyles(styles)(TaskStatusIcon)
