import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import TaskTable from 'components/task/TaskTable'
import RoleTable from 'pages/role/RoleTable'

import FormWrapper from 'components/form/Wrapper'

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 2,
  },
  paper: {
    padding: theme.spacing.unit * 5,
  },
  scrolling: {
    padding: theme.spacing.unit * 5,
    height: '68vh',
    overflow: 'auto'
  },
  dateTime: {
    whiteSpace: 'nowrap',
  },
  button: {
    marginRight: theme.spacing.unit * 2,
  },
  roleTableHeader: {
    paddingLeft: '0px',
  },
  spacer: {
    height: theme.spacing.unit * 2,
  },
})

class DeploymentForm extends React.Component {

  getTaskTable() {
    const {
      tasks,
      classes,
    } = this.props
    return (
      <Paper className={ classes.paper }>
        <Typography variant="h6" gutterBottom>
          Tasks
        </Typography>
        <TaskTable
          data={ tasks }
        />
      </Paper>
    )
  }

  getRoleTable() {
    const {
      roles,
      accessControlFormOpen,
      accessControlSearch,
      accessControlLevel,
      accessControlUsers,
      setAccessControlFormOpen,
      setAccessControlLevel,
      setAccessControlSearch,
      loadAccessControlResults,
      clearAccessControlResults,
      addRole,
      deleteRole,
      onCancelRoleForm,
      classes,
    } = this.props

    return (
      <Paper className={ classes.paper }>
        <RoleTable
          roles={ roles }
          onAdd={ addRole }
          onDelete={ deleteRole }
          onCancel={ onCancelRoleForm }
          title="Access Control"
          headerClassname={ classes.roleTableHeader }
          open={ accessControlFormOpen }
          search={ accessControlSearch }
          level={ accessControlLevel }
          users={ accessControlUsers }
          setOpen={ setAccessControlFormOpen }
          setLevel={ setAccessControlLevel }
          setSearch={ setAccessControlSearch }
          loadUsers={ loadAccessControlResults }
          clearUsers={ clearAccessControlResults }
        />
      </Paper>
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
      tasks,
      exists,
    } = this.props

    return (
      <div className={ classes.root }>
        <Grid container spacing={24}>
        {
          id != 'new' && (
            <Grid item xs={ 12 }>
              <div>
                {
                  this.getRoleTable()
                }
                <div className={ classes.spacer } />
                {
                  this.getTaskTable()
                }
              </div>
            </Grid>
          )
        }
          <Grid item xs={ 12}>
            <Paper className={ id != 'new' ? classes.scrolling : classes.paper }>
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
