import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 2,
  },
})

class DeploymentStatus extends React.Component {

  render() {
    const { 
      classes,
      id,
      clusterId,
      data,
    } = this.props

    return (
      <div className={ classes.root }>
        status
      </div>
    )
  }
}

DeploymentStatus.propTypes = {
  classes: PropTypes.object.isRequired,
}

DeploymentStatus.defaultProps = {
  
}

export default withStyles(styles)(DeploymentStatus)