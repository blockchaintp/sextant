import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import FormWrapper from 'components/form/Wrapper'

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 2,
  },
  paper: {
    padding: theme.spacing.unit * 5,
  },
})

const schema = [
  {
    id: 'username',
    title: 'Username',
    helperText: 'Enter your username',
    component: 'text',
    inputProps: {
      type: 'text',
    },
    validate: {
      type: 'string',
      methods: [
        ['matches', '^\\S+$', 'Cannot contain spaces'],
        ['min', 6, 'Must be at least 6 characters'],
        ['required', 'The username is required'], 
      ]
    }
  },
  {
    id: 'password',
    title: 'Password',
    helperText: 'Enter your password',
    component: 'text',
    inputProps: {
      type: 'password',
    },
    validate: {
      type: 'string',
      methods: [
        ['required', 'The password is required'],
        ['min', 6, 'Must be at least 6 characters'],
        ['matches', '^\\S+$', 'Cannot contain spaces'],
      ]
    }
  },
]

const initialValues = {
  username: '',
  password: '',
}

class Login extends React.Component {
  render() {
    const { 
      classes,
      login,
      error,
    } = this.props

    return (
      <div className={ classes.root }>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Paper className={ classes.paper }>
              <Typography variant="h6" gutterBottom>
                Login
              </Typography>
              <FormWrapper
                schema={ schema }
                initialValues={ initialValues }
                error={ error }
                onSubmit={ login }
                renderButtons={
                  ({
                    handleSubmit,
                  }) => (
                    <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      disabled={ false }
                      onClick={ handleSubmit }
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