import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles';
import LinearProgress from '@mui/material/LinearProgress'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import prettyBytes from 'pretty-bytes'

const styles = (theme) => ({
  root: {
    marginTop: theme.spacing(1),
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
      <Grid container spacing={1} className={classes.root}>
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
