import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles';
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import FormWrapper from 'components/form/Wrapper'

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
      dbId,
    } = this.props

    return (
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography _ci="formheader" id="formheader" variant="h6" gutterBottom>
                { title }
              </Typography>
              <FormWrapper
                dbId={dbId}
                schema={schema}
                initialValues={initialValues}
                error={error}
                onSubmit={submitForm}
                renderButtons={
                  ({
                    handleSubmit,
                  }) => (
                    <>
                      {
                        onCancel && (
                          <Button
                            className={classes.button}
                            type="button"
                            variant="contained"
                            onClick={onCancel}
                          >
                            Cancel
                          </Button>
                        )
                      }
                      <Button
                        _ci="submitButton"
                        id="submitButton"
                        className={classes.button}
                        type="button"
                        variant="contained"
                        color="primary"
                        disabled={submitting}
                        onClick={handleSubmit}
                      >
                        { submitTitle }
                      </Button>
                    </>

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
  error: PropTypes.string,
  title: 'User Details',
  submitTitle: 'Save',
  onCancel: PropTypes.func,
}

export default withStyles(styles)(UserForm)
