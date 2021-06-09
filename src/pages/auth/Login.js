import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import FormWrapper from 'components/form/Wrapper'

const styles = (theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(5),
  },
})

class Login extends React.Component {
  render() {
    const {
      classes,
      login,
      error,
      loading,
      initialValues,
      schema,
    } = this.props

    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography variant="h6" gutterBottom>
                Login
              </Typography>
              <FormWrapper
                schema={schema}
                initialValues={initialValues}
                error={error}
                onSubmit={login}
                renderButtons={
                  ({
                    handleSubmit,
                  }) => (
                    <Button
                      _ci="submitButton"
                      type="button"
                      variant="contained"
                      color="primary"
                      disabled={loading}
                      onClick={handleSubmit}
                    >
                      Login
                    </Button>
                  )
                }
              />
            </Paper>
          </Grid>
        </Grid>
      </div>
    )
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired,
}

export default withStyles(styles)(Login)
