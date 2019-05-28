import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import CodeBlock from 'components/code/CodeBlock'

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 2,
  },
  paper: {
    padding: theme.spacing.unit * 5,
  },
  button: {
    marginRight: theme.spacing.unit * 2,
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
      <div className={ classes.root }>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Paper className={ classes.paper }>
              <Typography variant="h6" gutterBottom>
                Your Access Token is shown below - use it to access the sextant REST api.
              </Typography>
              <CodeBlock
                code={ accessToken }
                clipboard={ true }
                snackbarMessage={ snackbarMessage }
              />
              <Button
                className={ classes.button }
                type="button"
                variant="contained"
                color="primary"
                disabled={ submitting }
                onClick={ refreshToken }
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

export default withStyles(styles)(AccessTokenPage)