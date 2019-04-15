import React from 'react'
import PropTypes from 'prop-types'
import { connectStore } from 'redux-box'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import { lighten } from '@material-ui/core/styles/colorManipulator'
import { reduxForm, Field } from 'redux-form'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import settings from '../settings'
import configModule from '../store/config'
import authModule from '../store/auth'
import selectors from '../store/selectors'

import withRouter from '../utils/withRouter'
import validators from '../utils/validators'

import Loading from '../components/Loading'
import LoginForm from '../components/LoginForm'

const styles = theme => {
  return {
    container: {
      marginTop: theme.spacing.unit * 2,
      padding: theme.spacing.unit * 2,
    },
    paper: {
      padding: theme.spacing.unit * 2,
    },
  }
}

const DEFAULT_DATA = {
  username: '',
  password: '', 
}

@reduxForm({
  form: 'loginForm',
  initialValues: DEFAULT_DATA,
})
@connectStore({
  config: configModule,
  auth: authModule,
})
@connect(
  (state, ownProps) => {

    const formValues = selectors.form.values(state, 'loginForm')
    const formErrors = selectors.form.errorMessages(state, 'loginForm')

    return {
      formValues,
      syncFormErrors: formErrors,
    }
  },
  (dispatch) => {
    return {
      
    }
  }
)
class Login extends React.Component {

  render() {
    const { 
      classes,
      auth,
      formValues,
      syncFormErrors,
    } = this.props

    const {
      showSyncFormErrors,
      asyncFormError,
      submitting,
    } = auth

    return (
      <Grid
        container
        direction='row'
        justify='center'
        alignItems='center'
        className={ classes.container }
      >
        <Grid
          item
          xs={8}
        >
          <Paper
            className={ classes.paper }
          >
            <div>
              <Typography
                variant='h6'
              >
                Login
              </Typography>
              <LoginForm
                formValues={ formValues }
                saveTitle='Login'
                submitting={ submitting }
                syncFormErrors={ syncFormErrors }
                showSyncFormErrors={ showSyncFormErrors }
                asyncFormError={ asyncFormError }
                onSubmit={ () => auth.login(true) }
              />
            </div>
          </Paper>

        </Grid>
      </Grid>
    )
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Login)