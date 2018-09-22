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
import GenerateTextField from './GenerateTextField'
import Select from './Select'
import MultipleCheckbox from './MultipleCheckbox'
import Radio from './Radio'

import validators from '../utils/validators'
import randomValues from '../utils/randomValues'

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

const activatedOptions = [{
  value: 'true',
  title: 'Enabled'
},{
  value: 'false',
  title: 'Disabled'
}]

class DeploymentForm extends React.Component {

  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        
        <Typography
          variant='subheading'
        >
          Network
        </Typography>

        <Grid
          container
          spacing={ 24 }
        >
          <Grid
            item
            xs={12}
            md={6}
          >
            <Field
              name="network_name"
              type="text"
              component={ TextField }
              label="Network Name"
              description="The name of the sawtooth network"
              validate={ validators.cluster.name }
              disabled={ this.props.submitting }
            />
          </Grid>

        </Grid>

        <Divider className={ classes.divider } />

        <Typography
          variant='subheading'
        >
          Poet
        </Typography>

        <Grid
          container
          spacing={ 24 }
        >
          <Grid
            item
            xs={12}
            md={6}
          >
            <Field
              row
              compact
              name="poet_enabled"
              component={ Radio }
              options={ activatedOptions }
              description="Should the POET consensus protocol be active on this network?"
              validate={ validators.required }
              disabled={ this.props.submitting }
            />
          </Grid>

        </Grid>

        <Divider className={ classes.divider } />

        <Typography
          variant='subheading'
        >
          RBAC
        </Typography>

        <Grid
          container
          spacing={ 24 }
        >
          <Grid
            item
            xs={12}
            md={6}
          >
            <Field
              row
              compact
              name="rbac_enabled"
              component={ Radio }
              options={ activatedOptions }
              description="Should the RBAC transaction processor be deployed?"
              validate={ validators.required }
              disabled={ this.props.submitting }
            />
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
          >
            <Field
              name="rbac_secret_key"
              type="text"
              component={ GenerateTextField }
              generateValue={ randomValues.rbacSecretKey }
              label="Secret Key"
              description="The RBAC secret key (20 chars, alphanumeric)"
              validate={ validators.deployment.rbac_secret_key }
              disabled={ this.props.submitting }
            />
          </Grid>

        </Grid>

        <Grid
          container
          spacing={ 24 }
        >
          <Grid
            item
            xs={12}
            md={6}
          >
            <Field
              name="rbac_aes_key"
              type="text"
              component={ GenerateTextField }
              generateValue={ randomValues.rbacAesKey }
              label="Secret Key"
              description="The RBAC AES key (32 chars, hexadecimal)"
              validate={ validators.deployment.rbac_aes_key }
              disabled={ this.props.submitting }
            />
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
          >
            <Field
              name="rbac_batcher_key"
              type="text"
              component={ GenerateTextField }
              generateValue={ randomValues.rbacBatcherKey }
              label="Secret Key"
              description="The RBAC batcher key (64 chars, hexadecimal)"
              validate={ validators.deployment.rbac_batcher_key }
              disabled={ this.props.submitting }
            />
          </Grid>

        </Grid>

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
          <Button
            variant="raised"
            className={ classes.button }
            onClick={ () => this.props.onCancel() }
            disabled={ this.props.submitting }
          >
            Cancel
          </Button>
          <Button
            color="primary"
            variant="raised"
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

DeploymentForm.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(DeploymentForm)
