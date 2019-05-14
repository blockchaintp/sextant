import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import SimpleTable from 'components/table/SimpleTable'
import TaskStatusIcon from 'components/status/TaskStatusIcon'
import TaskActionIcon from 'components/status/TaskActionIcon'

import FormWrapper from 'components/form/Wrapper'

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 2,
  },
  paper: {
    padding: theme.spacing.unit * 5,
  },
  dateTime: {
    whiteSpace: 'nowrap',
  },
  button: {
    marginRight: theme.spacing.unit * 2,
  },
  errorContainer: {
    maxWidth: '200px',
  },
  errorText: {
    color: theme.palette.error.main,
  },
  statusContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'left',
  },
  statusIcon: {
    marginRight: theme.spacing.unit * 2,
  },
})

class DeploymentForm extends React.Component {

  getTaskTable() {
    const {
      classes,
      tasks,
    } = this.props

    const fields =[{
      title: 'Started',
      name: 'started_at',
    }, {
      title: 'Action',
      name: 'action',
    }, {
      title: 'Status',
      name: 'status',
    }]

    const data = tasks.map((task, index) => {
      return {
        id: task.id,
        started_at: (
          <span className={ classes.dateTime }>
            { new Date(task.started_at).toLocaleString() }
          </span>
        ),
        action: (
          <div className={ classes.statusContainer }>
            <div className={ classes.statusIcon }>
              <TaskActionIcon
                action={ task.action.split('.')[1] }
              />
            </div>
            <div>
              { task.action }
            </div>
          </div>
        ),
        status: (
          <div className={ classes.statusContainer }>
            <div className={ classes.statusIcon }>
              <TaskStatusIcon
                status={ task.status }
              />
            </div>
            <div>
              { !task.error && task.status }
              {
                task.error && (
                  <div className={ classes.errorContainer }>
                    <span className={ classes.errorText }>
                      { task.error }
                    </span>
                  </div>
                )
              }
            </div>
          </div>
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
      clusterId,
      validate,
      exists,
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
                exists={ exists }
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
                            onClick={ () => onCancel(clusterId) }
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

DeploymentForm.propTypes = {
  classes: PropTypes.object.isRequired,
  submitForm: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired, 
  error: PropTypes.string,
  title: PropTypes.string,
  submitTitle: PropTypes.string,
  onCancel: PropTypes.func,
}

DeploymentForm.defaultProps = {
  title: 'Deployment Details',
  submitTitle: 'Submit',
}

export default withStyles(styles)(DeploymentForm)