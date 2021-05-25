import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import LinearProgress from '@material-ui/core/LinearProgress'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import prettyBytes from 'pretty-bytes'

const styles = (theme) => ({
  root: {
    marginTop: theme.spacing.unit,
  },
  rightAlign: {
    textAlign: 'right',
  },
})

class UploadFileProgressBar extends React.Component {
  render() {
    const {
      classes,
      color,
      filename,
      size,
      uploadedBytes,
      // eslint-disable-next-line no-unused-vars
      totalBytes,
      percentDone,
      remainingTime,
    } = this.props

    const timeLeftSeconds = Math.round(remainingTime / 1000) + 1
    const timeLeftMinutes = Math.floor(timeLeftSeconds / 60)
    const timeLeftMinutesSeconds = timeLeftSeconds % 60

    const timeLeft = timeLeftSeconds < 60
      ? `${timeLeftSeconds} secs`
      : `${timeLeftMinutes} mins ${timeLeftMinutesSeconds} secs`

    return (
      <Grid container spacing={8} className={classes.root}>
        <Grid item xs={12}>
          <Typography variant="body2">
            { filename }
            {' '}
            -
            {' '}
            { prettyBytes(size) }
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <LinearProgress
            variant="determinate"
            value={percentDone}
            color={color}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography variant="caption">
            { `${prettyBytes(uploadedBytes)} - ${percentDone}%` }
          </Typography>
        </Grid>
        {
          remainingTime > 0 && (
            <Grid item xs={6} className={classes.rightAlign}>
              <Typography variant="caption">
                { timeLeft }
                {' '}
                remaining
              </Typography>
            </Grid>
          )
        }
      </Grid>
    )
  }
}

UploadFileProgressBar.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(UploadFileProgressBar)
