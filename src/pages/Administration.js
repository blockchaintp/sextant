import React from 'react'
import withStyles from '@mui/styles/withStyles';
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

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
        <Grid container spacing={3}>
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
