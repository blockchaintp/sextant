import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'

const styles = theme => {
  return {
    errorText: {
      color: 'red',
    },
  }
}

class ClusterStatus extends React.Component {

  getClusterCreating() {
    const { classes } = this.props
    return (
      <div>
        <Typography
          variant='subheading'
        >
          Creating (this can take between 5 and 10 minutes)...
        </Typography>
        <CircularProgress
          className={ classes.progress }
          size={ 20 }
        />
      </div>
    )
  }

  getClusterError() {
    const { cluster, classes } = this.props
    const { settings, status } = cluster

    return (
      <div>
        <Typography
          variant='subheading'
          className={ classes.errorText }
        >
          Error
        </Typography>
        <Typography
          variant='body2'
          className={ classes.errorText }
        >
          { status.error }
        </Typography>
      </div>
    )
  }

  render() {
    const { cluster, classes } = this.props
    const { settings, status } = cluster

    if(status.phase == 'creating') {
      return this.getClusterCreating()
    }
    else if(status.phase == 'error') {
      return this.getClusterError()
    }
    else {
      return (
        <div>
          <Typography
            variant='subheading'
          >
            Unknown Status: { status.phase }
          </Typography>
        </div>
      )
    }
  }
}

ClusterStatus.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(ClusterStatus)