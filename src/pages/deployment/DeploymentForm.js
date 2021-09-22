/* eslint-disable react/no-unused-state */
/* eslint-disable react/jsx-fragments */
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
import CustomizationPanel from 'components/deployment/CustomizationPanel'

const styles = (theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(5),
  },
  scrolling: {
    padding: theme.spacing(5),
    height: '68vh',
    overflow: 'auto',
  },
  dateTime: {
    whiteSpace: 'nowrap',
  },
  button: {
    marginRight: theme.spacing(2),
  },
  panel: {
    width: '49.2%',
    marginBottom: theme.spacing(2),
  },
  roleTableHeader: {
    paddingLeft: '0px',
  },
  spacer: {
    height: theme.spacing(6),
  },
})

class DeploymentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
    };
    this.inputToState = this.inputToState.bind(this)
  }

  getTaskTable() {
    const {
      tasks,
      classes,
    } = this.props
    return (
      <Paper className={classes.paper}>
        <Typography variant="h6" gutterBottom>
          Tasks
        </Typography>
        <TaskTable
          data={tasks}
        />
      </Paper>
    )
  }

  getRoleTable() {
    const {
      roles,
      userList,
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
      editRole,
      onCancelRoleForm,
      classes,
    } = this.props

    return (
      <Paper className={classes.paper}>
        <RoleTable
          roles={roles}
          onAdd={addRole}
          onDelete={deleteRole}
          onEdit={editRole}
          onCancel={onCancelRoleForm}
          title="Access Control"
          headerClassname={classes.roleTableHeader}
          open={accessControlFormOpen}
          search={accessControlSearch}
          level={accessControlLevel}
          users={accessControlUsers}
          userList={userList}
          setOpen={setAccessControlFormOpen}
          setLevel={setAccessControlLevel}
          setSearch={setAccessControlSearch}
          loadUsers={loadAccessControlResults}
          clearUsers={clearAccessControlResults}
        />
      </Paper>
    )
  }

  inputToState(payload) {
    this.setState({ input: payload })
  }

  render() {
    const {
      id,
      classes,
      title,
      submitForm,
      schema,
      initialValues,
      error,
      submitting,
      onCancel,
      clusterId,
      validate,
      exists,
      saveYamlInput,
      yamlInput,
      customYaml,
    } = this.props

    return (
      <div className={classes.root}>
        <Grid container spacing={3}>
          {
          id !== 'new' && (
            <Grid item xs={12}>
              <div>
                {
                  this.getRoleTable()
                }
                <div className={classes.spacer} />
                {
                  this.getTaskTable()
                }
              </div>
            </Grid>
          )
        }
          <Grid item xs={12}>
            <Paper className={id !== 'new' ? classes.scrolling : classes.paper}>
              <Typography _ci="formheader" variant="h6" gutterBottom>
                { title }
              </Typography>
              <FormWrapper
                schema={schema}
                initialValues={initialValues}
                error={error}
                onSubmit={submitForm}
                validate={validate}
                exists={exists}
                renderButtons={
                  ({
                    handleSubmit,
                  }) => (
                    <React.Fragment>
                      <div className={classes.panel}>
                        <CustomizationPanel
                          inputToState={this.inputToState}
                          saveYamlInput={saveYamlInput}
                          customYaml={customYaml}
                          yamlInput={yamlInput}
                        />
                      </div>
                      <div className={classes.spacer} />
                      {
                        onCancel && (
                          <Button
                            className={classes.button}
                            type="button"
                            variant="contained"
                            onClick={() => onCancel(clusterId)}
                          >
                            Cancel
                          </Button>
                        )
                      }
                      <Button
                        className={classes.button}
                        type="button"
                        variant="contained"
                        color="primary"
                        disabled={submitting}
                        onClick={handleSubmit}
                      >
                        {id === 'new' ? 'deploy' : 're-deploy' }
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
  title: PropTypes.string,
}

DeploymentForm.defaultProps = {
  title: 'Deployment Details',
}

export default withStyles(styles)(DeploymentForm)
