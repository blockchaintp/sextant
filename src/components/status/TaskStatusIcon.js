import React from 'react'
import PropTypes from 'prop-types'

import withStyles from '@mui/styles/withStyles'
import Chip from '@mui/material/Chip'
import CircularProgressIcon from '@mui/material/CircularProgress'
import ErrorIcon from '@mui/icons-material/Error'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import Tooltip from '@mui/material/Tooltip'

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
  chip: {
    height: '38px',
    borderRadius: '36px',
  },
})

class TaskStatusIcon extends React.Component {
  render() {
    const {
      classes,
      error,
      status,
    } = this.props

    if (status === 'running' || status === 'created') {
      return (
        <Chip className={classes.chip} icon={<CircularProgressIcon />} label={status} />
      )
    }
    if (status === 'error') {
      return (
        <Tooltip title={error}>
          <Chip
            className={classes.chip}
            icon={<ErrorIcon />}
            label="error"
            color="error"
          />
        </Tooltip>
      )
    }
    if (status === 'finished') {
      return (
        <Chip className={classes.chip} icon={<CheckCircleIcon />} label={status} />
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
