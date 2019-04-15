import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'

const styles = theme => {
  return {
    container: {
      
    },
  }
}

class InfoPanel extends React.Component {

  render() {
    const { classes, data } = this.props

    const parts = data.reduce((all, row, i) => {
      return all.concat([
        <Grid
          key={ `title-${i}` }
          item
          xs={3}
        >
          <Typography
            variant='body1'
          >
            { row.title }
          </Typography>
        </Grid>,
        <Grid
          key={ `value-${i}` }
          item
          xs={9}
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

InfoPanel.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(InfoPanel)