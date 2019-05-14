import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

const styles = theme => {
  return {}
}

class DeploymentSummary extends React.Component {
  
  
  render() {
    const { classes, data } = this.props

    const parts = data.reduce((all, row, i) => {
      return all.concat([
        <Grid
          key={ `title-${i}` }
          item
          xs={6}
        >
          <Typography>
            <strong>{ row.title }:</strong>
          </Typography>
        </Grid>,
        <Grid
          key={ `value-${i}` }
          item
          xs={6}
        >
          <Typography>
            { row.value }
          </Typography>
        </Grid>
      ])
    }, [])

    return (
      <Grid
        container
        direction='row'
        className={ classes.container }
      >

      { parts }

      </Grid>
    )
  }
}

DeploymentSummary.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(DeploymentSummary)