import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import { Field } from 'redux-form'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import FormHelperText from '@material-ui/core/FormHelperText'

import TextField from './TextField'
import validators from '../utils/validators'

const styles = theme => ({
  root: {
    marginTop: '10px',
    width: '99%'
  },
  divider: {
    marginTop: '20px',
    marginBottom: '20px',
  },
  button: {
    margin: theme.spacing.unit,
  },
  errorList: {
    color: '#f44336'
  },
  margin: {
    margin: theme.spacing.unit,
  },
  smallText: {
    fontSize: '0.7em'
  },
  alignRight: {
    textAlign: 'right',
  },
})

class UserForm extends React.Component {

  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>

        <Field
          name="username"
          type="text"
          component={ TextField }
          label="Username"
          description="The username for the user"
          validate={ validators.user.username }
          disabled={ this.props.submitting }
        />

        <Field
          name="password"
          type="password"
          component={ TextField }
          label="Password"
          description="The password for the user (min 6 chars - alphanumeric)"
          validate={ 
            this.props.newUser ? 
              validators.user.requiredPassword :
              validators.user.optionalPassword 
          }
          disabled={ this.props.submitting }
        />

        <Field
          name="confirm_password"
          type="password"
          component={ TextField }
          label="Confirm Password"
          description="Confirm the password for the user"
          validate={ 
            this.props.newUser ? 
              validators.user.requiredPassword :
              validators.user.optionalPassword 
          }
          disabled={ this.props.submitting }
        />

        {
          this.props.showSyncFormErrors && this.props.syncFormErrors.length > 0 ? (
            <div>
              <Divider className={ classes.divider } />

              <FormHelperText error>
                The form has errors - please correct them before re-submitting:
              </FormHelperText>

              <ul className={ classes.errorList }>
                { 
                  this.props.syncFormErrors.map((errorString, i) => (
                    <li key={ i }>
                      <FormHelperText error>
                        { errorString }
                      </FormHelperText>
                    </li>
                  ))
                }
              </ul>
            </div>
          ) : null
        }

        {
          this.props.asyncFormError ? (
            <div>
              <Divider className={ classes.divider } />

              <FormHelperText error>
                { this.props.asyncFormError }
              </FormHelperText>

            </div>
          ) : null
        }

        <Divider className={ classes.divider } />

        <div>
          {
            this.props.allowCancel ? (
              <Button
                variant="contained"
                className={ classes.button }
                onClick={ () => this.props.onCancel() }
                disabled={ this.props.submitting }
              >
                Cancel
              </Button>
            ) : null
          }
          
          <Button
            color="primary"
            variant="contained"
            className={ classes.button }
            onClick={ () => this.props.onSubmit() }
            disabled={ this.props.submitting }
          >
            { this.props.saveTitle || 'Save' }
          </Button>
        </div>
        
      </div>
    )
  }
}

UserForm.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(UserForm)
