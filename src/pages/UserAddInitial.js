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
import userModule from '../store/user'
import selectors from '../store/selectors'

import withRouter from '../utils/withRouter'
import validators from '../utils/validators'

import Loading from '../components/Loading'
import UserForm from '../components/UserForm'

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
  username: 'admin',
  type: 'admin',
  password: '',
  confirm_password: '',
}

@reduxForm({
  form: 'userForm',
  initialValues: DEFAULT_DATA,
  validate: validators.user.allNew,
})
@connectStore({
  config: configModule,
  user: userModule,
})
@connect(
  (state, ownProps) => {

    const formValues = selectors.form.values(state, 'userForm')
    const formErrors = selectors.form.errorMessages(state, 'userForm')

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
class UserAddInitial extends React.Component {

  render() {
    const { 
      classes,
      user,
      formValues,
      syncFormErrors,
    } = this.props

    const {
      showSyncFormErrors,
      asyncFormError,
      submitting,
    } = user

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
                Create Initial User Account
              </Typography>
              <UserForm
                formValues={ formValues }
                saveTitle='Create User'
                submitting={ submitting }
                syncFormErrors={ syncFormErrors }
                showSyncFormErrors={ showSyncFormErrors }
                asyncFormError={ asyncFormError }
                onSubmit={ () => user.submitForm(true) }
                allowCancel={ false }
                newUser={ true }
                initialUser={ true }
              />
            </div>
          </Paper>

        </Grid>
      </Grid>
    )
  }
}

UserAddInitial.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UserAddInitial)