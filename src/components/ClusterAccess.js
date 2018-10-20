import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'

const styles = theme => {
  return {
    button: {
      margin: theme.spacing.unit,
    },
  }
}

class ClusterAccess extends React.Component {

  render() {

    const { classes } = this.props

    return (
      <div>
        {
          this.props.kubeConfigExists ? (
            <Button 
              className={ classes.button }
              color="primary" 
              variant="contained"
              size="small"
              autoFocus
              onClick={ this.props.downloadKubeConfig }
            >
              Download Kube Config
            </Button>
          ) : null
        }
        
        {
          this.props.kopsConfigExists ? (
            <Button 
              className={ classes.button }
              color="primary" 
              variant="contained"
              size="small"
              autoFocus
              onClick={ this.props.downloadKopsConfig }
            >
              Download Kops Config
            </Button>
          ) : null
        }
        
      </div>
    )
  }
}

ClusterAccess.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(ClusterAccess)