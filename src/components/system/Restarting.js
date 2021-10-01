import React from 'react'
import PropTypes from 'prop-types'

import withStyles from '@mui/styles/withStyles';
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'

const styles = (theme) => ({
  container: {
    maxWidth: '50%',
  },
  item: {
    padding: theme.spacing(2),
  },
  root: {
    padding: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(5),
  },
  button: {
    marginRight: theme.spacing(2),
  },
  restart: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
})

class Restarting extends React.Component {
  render() {
    const {
      classes,
      color,
      message,
    } = this.props

    return (
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <div className={classes.restart}>
                <CircularProgress
                  color={color}
                />
                {
                message && (
                  <Typography
                    variant="subtitle1"
                    color={color}
                    className={classes.item}
                  >
                    {message}
                  </Typography>
                )
              }
              </div>
            </Paper>
          </Grid>
        </Grid>
      </div>
    )
  }
}

Restarting.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.string,
  message: PropTypes.string,
}

Restarting.defaultProps = {
  color: 'primary',
  message: 'Restarting',
}

export default withStyles(styles)(Restarting)
