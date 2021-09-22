import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'

const styles = (theme) => ({
  rightAlign: {
    textAlign: 'right',
    paddingRight: theme.spacing(2),
  },
})

const formatSummaryValues = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => (
      <Tooltip title={item}>
        <Typography noWrap="true">
          {item}
        </Typography>
      </Tooltip>
    ))
  }
  return ([
    <Typography>
      {value}
    </Typography>,
  ])
}

class SummaryValues extends React.Component {
  render() {
    const {
      classes,
      data,
    } = this.props

    const parts = data.reduce((all, row, i) => all.concat([
      <Grid
        key={`title-${i}`}
        item
        xs={6}
      >
        <Typography className={classes.rightAlign}>
          <strong>
            {row.title}
            :
          </strong>
        </Typography>
      </Grid>,
      <Grid
        key={`value-${i}`}
        item
        xs={6}
      >
        {formatSummaryValues(row.value)}
      </Grid>,
    ]), [])

    return (
      <Grid
        container
        direction="row"
        className={classes.container}
        spacing={1}
      >

        {parts}

      </Grid>
    )
  }
}

SummaryValues.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(SummaryValues)
