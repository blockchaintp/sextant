import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles';
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CodeBlock from 'components/code/CodeBlock'

const styles = (theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(5),
  },
  button: {
    marginRight: theme.spacing(2),
  },
})

class AccessTokenPage extends React.Component {
  render() {
    const {
      classes,
      accessToken,
      refreshToken,
      submitting,
      snackbarMessage,
    } = this.props

    return (
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography variant="h6" gutterBottom>
                Your Access Token is shown below - use it to access the sextant REST api.
              </Typography>
              <CodeBlock
                code={accessToken}
                clipboard
                snackbarMessage={snackbarMessage}
              />
              <Button
                className={classes.button}
                type="button"
                variant="contained"
                color="primary"
                disabled={submitting}
                onClick={refreshToken}
              >
                Refresh Access Token
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </div>
    )
  }
}

AccessTokenPage.propTypes = {
  classes: PropTypes.object.isRequired,
  accessToken: PropTypes.string,
  refreshToken: PropTypes.func.isRequired,
}

AccessTokenPage.defaultProps = {
  accessToken: PropTypes.string,
}

export default withStyles(styles)(AccessTokenPage)
