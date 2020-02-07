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
  button: {
    marginRight: theme.spacing.unit * 2,
  },
})

class UserForm extends React.Component {
  render() {
    const { 
      classes,
      title,
      submitTitle,
      submitForm,
      schema,
      initialValues,
      error,
      submitting,
      onCancel,
      dbId
    } = this.props
    
    
    return (
      <div className={ classes.root }>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Paper className={ classes.paper }>
              <Typography _ci='formheader' variant="h6" gutterBottom>
                { title }
              </Typography>
              <FormWrapper
                dbId={dbId}
                schema={ schema }
                initialValues={ initialValues }
                error={ error }
                onSubmit={ submitForm }
                renderButtons={
                  ({
                    handleSubmit,
                  }) => (
                    <React.Fragment>
                      {
                        onCancel && (
                          <Button
                            className={ classes.button }
                            type="button"
                            variant="contained"
                            onClick={ onCancel }
                          >
                            Cancel
                          </Button>
                        )
                      }
                      <Button
                        _ci='submitButton'
                        className={ classes.button }
                        type="button"
                        variant="contained"
                        color="primary"
                        disabled={ submitting }
                        onClick={ handleSubmit }
                      >
                        { submitTitle }
                      </Button>
                    </React.Fragment>
                    
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

UserForm.propTypes = {
  classes: PropTypes.object.isRequired,
  submitForm: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired, 
  error: PropTypes.string,
  title: PropTypes.string,
  submitTitle: PropTypes.string,
  onCancel: PropTypes.func,
}

UserForm.defaultProps = {
  title: 'User Details',
  submitTitle: 'Save',
}

export default withStyles(styles)(UserForm)