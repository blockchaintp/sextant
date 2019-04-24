import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import SimpleTable from 'components/table/SimpleTable'
import SimpleTableHeader from 'components/table/SimpleTableHeader'

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
  errorText: {
    color: theme.palette.error.main,
  },
})

class ClusterForm extends React.Component {

  getTaskTable() {
    const {
      classes,
      tasks,
    } = this.props

    const fields =[{
      title: 'Action',
      name: 'action',
    }, {
      title: 'Status',
      name: 'status',
    }, {
      title: 'Started',
      name: 'started_at',
    }, , {
      title: 'Error',
      name: 'error',
    }]

    const data = tasks.map((task, index) => {
      return {
        id: task.id,
        action: task.action,
        status: task.status,
        started_at: new Date(task.started_at).toLocaleString(),
        error: (
          <span className={ classes.errorText }>
            { task.error }
          </span>
        ),
      }
    })

    return (
      <div>
        <SimpleTable
          data={ data }
          fields={ fields }
        />
      </div>
    )
  }

  render() {
    const { 
      id,
      classes,
      title,
      submitTitle,
      submitForm,
      schema,
      initialValues,
      error,
      submitting,
      onCancel,
      validate,
    } = this.props

    return (
      <div className={ classes.root }>
        <Grid container spacing={24}>
          <Grid item xs={ id == 'new' ? 12 : 6 }>
            <Paper className={ classes.paper }>
              <Typography variant="h6" gutterBottom>
                { title }
              </Typography>
              <FormWrapper
                schema={ schema }
                initialValues={ initialValues }
                error={ error }
                onSubmit={ submitForm }
                validate={ validate }
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
          {
            id != 'new' && (
              <Grid item xs={ 6 }>
                <Paper className={ classes.paper }>
                  <Typography variant="h6" gutterBottom>
                    Tasks
                  </Typography>
                  { this.getTaskTable() }
                </Paper>
              </Grid>
            )
          }
        </Grid>
      </div>
    )
  }
}

ClusterForm.propTypes = {
  classes: PropTypes.object.isRequired,
  submitForm: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired, 
  error: PropTypes.string,
  title: PropTypes.string,
  submitTitle: PropTypes.string,
  onCancel: PropTypes.func,
}

ClusterForm.defaultProps = {
  title: 'Cluster Details',
  submitTitle: 'Submit',
}

export default withStyles(styles)(ClusterForm)