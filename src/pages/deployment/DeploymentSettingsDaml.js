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

class DeploymentSettingsDaml extends React.Component {

  render() {
    const {
      classes,
      cluster,
      id,
      deployment,
    } = this.props

    console.log('--------------------------------------------')
    console.dir(this.props)

    return (
      <div className={ classes.root }>
        daml
      </div>
    )
  }
}

DeploymentSettingsDaml.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(DeploymentSettingsDaml)