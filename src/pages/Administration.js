import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

const styles = (theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(5),
  },
  button: {
    marginRight: theme.spacing(2),
    margin: theme.spacing(2),
  },
})

class Administration extends React.Component {
  render() {
    const {
      classes,
      title,
      onRestart,
    } = this.props

    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography variant="h6" gutterBottom>
                {title}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={onRestart}
                className={classes.button}
              >
                restart
              </Button>
              <Typography variant="caption" gutterBottom>
                Clicking this button will restart the Sextant application container
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </div>
    )
  }
}

Administration.defaultProps = {
  title: 'Administration',
}

export default withStyles(styles)(Administration)
