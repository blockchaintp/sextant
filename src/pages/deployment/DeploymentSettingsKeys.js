import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  root: {
    
  },
  paper: {
    padding: theme.spacing.unit * 5,
  },
})

class DeploymentSettingsKeys extends React.Component {

  render() {
    const {
      classes,
      cluster,
      id,
      deployment,
    } = this.props

    return (
      <div className={ classes.root }>
        keys
      </div>
    )
  }
}

DeploymentSettingsKeys.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(DeploymentSettingsKeys)