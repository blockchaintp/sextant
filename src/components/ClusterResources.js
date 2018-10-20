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
      overflow: 'auto',
    }
  }
}

class ClusterResources extends React.Component {

  hasXoDemo() {
    const { info } = this.props
    if(!info.xodemo) return false
    if(!info.xodemo.status.loadBalancer) return false
    if(!info.xodemo.status.loadBalancer.ingress) return false
    return true
  }

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
        {
          this.hasXoDemo() ? (
            <Button 
              className={ classes.button }
              color="primary" 
              variant="raised"
              size="small"
              autoFocus
              onClick={ () => this.props.onOpenXoDemo() }
            >
              Open XO Demo
            </Button>
          ) : null
        }
      </div>
    )
  }
}

ClusterResources.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(ClusterResources)