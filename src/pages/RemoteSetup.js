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
import selectors from '../store/selectors'

import withRouter from '../utils/withRouter'
import validators from '../utils/validators'

import Loading from '../components/Loading'
import RemoteForm from '../components/RemoteForm'

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
  name: '',
}

@reduxForm({
  form: 'remoteForm',
  initialValues: DEFAULT_DATA,
})
@connectStore({
  config: configModule,
})
@connect(
  (state, ownProps) => {

    const formValues = selectors.form.values(state, 'remoteForm')
    const formErrors = selectors.form.errorMessages(state, 'remoteForm')

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
class RemoteSetup extends React.Component {

  render() {
    const { 
      classes,
      config,
      formValues,
      syncFormErrors,
    } = this.props

    const {
      showSyncFormErrors,
      asyncFormError,
      submitting,
    } = config

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
                Setup S3 bucket
              </Typography>
              <Typography>
                Enter the name of an S3 bucket to use for sextant storage.
              </Typography>
              <Typography>
                This can be a new bucket (it will be created) or an existing sextant storage bucket.
              </Typography>
              <RemoteForm
                formValues={ formValues }
                saveTitle='Save'
                submitting={ submitting }
                syncFormErrors={ syncFormErrors }
                showSyncFormErrors={ showSyncFormErrors }
                asyncFormError={ asyncFormError }
                onSubmit={ () => config.saveRemoteForm(true, false) }
              />
            </div>
          </Paper>

        </Grid>
      </Grid>
    )
  }
}

RemoteSetup.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RemoteSetup)