import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'

const styles = theme => {
  return {
    button: {
      margin: theme.spacing.unit,
    },
    resources: {
      padding: theme.spacing.unit * 2,
      backgroundColor: '#f5f5f5',
      border: '1px dashed #ccc',
    }
  }
}

class ClusterResources extends React.Component {

  render() {

    const { classes, info } = this.props

    if(!info) return null
    return (
      <div>
        <pre className={ classes.resources }>
          <code>
            { info.pods }
          </code>
        </pre>
        <Button 
          className={ classes.button }
          color="primary" 
          variant="raised"
          size="small"
          autoFocus
          onClick={ () => this.props.onOpenDashboard() }
        >
          Open Dashboard
        </Button>
        <Button 
          className={ classes.button }
          color="primary" 
          variant="raised"
          size="small"
          autoFocus
          onClick={ () => this.props.onOpenMonitoring() }
        >
          Open Monitoring
        </Button>
      </div>
    )
  }
}

ClusterResources.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(ClusterResources)