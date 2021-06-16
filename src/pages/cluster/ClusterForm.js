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
import CodeBlock from 'components/code/CodeBlock'

import saveAs from 'file-saver'

const HELP_CREATE_SERVICEACCOUNT = `#!/bin/bash -e

set -e

SERVICEACCOUNT="sextant"
NAMESPACE="default"

# create the service account:
echo "creating serviceaccount: $SERVICEACCOUNT in namespace $NAMESPACE"
kubectl create -n $NAMESPACE serviceaccount $SERVICEACCOUNT

# get the RBAC api versions
RBAC_API_VERSIONS=$(kubectl api-versions | grep rbac)

# If RBAC is enabled - assign cluster-admin role to service account:
if [ -n "$RBAC_API_VERSIONS" ]; then
  echo "creating clusterrolebinding: $SERVICEACCOUNT in namespace $NAMESPACE"
  kubectl create -n $NAMESPACE clusterrolebinding $SERVICEACCOUNT --clusterrole=cluster-admin --serviceaccount=$NAMESPACE:$SERVICEACCOUNT
fi
`

const HELP_GET_VALUES = `#!/bin/bash -e

set -e

SERVICEACCOUNT="sextant"
NAMESPACE="default"

# get the secret name for the service account:
echo "getting the secret name for serviceaccount: $SERVICEACCOUNT in namespace $NAMESPACE"
SECRETNAME=$(kubectl get -n $NAMESPACE serviceaccounts sextant -o "jsonpath={..secrets[0].name}")

# get the base64 bearer token:
echo "getting the bearer token for serviceaccount: $SERVICEACCOUNT in namespace $NAMESPACE"
BASE64_BEARER_TOKEN=$(kubectl get secret -n $NAMESPACE $SECRETNAME -o "jsonpath={..data.token}")

# get the base64 CA:
echo "getting the certificate authority for serviceaccount: $SERVICEACCOUNT in namespace $NAMESPACE"
BASE64_CA_FILE=$(kubectl get secret -n $NAMESPACE $SECRETNAME -o "jsonpath={.data['ca\\.crt']}")

# get the api server address:
echo "getting the api server address"
APISERVER=$(kubectl config view --minify -o jsonpath='{..clusters[0].cluster.server}')

# print out the details:
echo
echo "your access credentials are printed below:"
echo
echo "-----------"
echo "apiServer |"
echo "-----------"
echo
echo $APISERVER
echo
echo "-------"
echo "token |"
echo "-------"
echo
echo -n $BASE64_BEARER_TOKEN | base64 --decode
echo
echo
echo "-----"
echo "ca: |"
echo "-----"
echo
echo -n $BASE64_CA_FILE | base64 --decode
echo
`

const styles = (theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(5),
  },
  dateTime: {
    whiteSpace: 'nowrap',
  },
  button: {
    marginRight: theme.spacing(2),
  },
  text: {
    fontFamily: 'Roboto',
  },
  codeblock: {
    width: '100%',
    overflowX: 'auto',
  },
  roleTableHeader: {
    paddingLeft: '0px',
  },
  spacer: {
    height: theme.spacing(2),
  },
  child: {
    flexGrow: 1,
    flexBasis: '50%',
  },
  box: {
    display: 'flex',
    maxHeight: '800px',
  },
})

class ClusterForm extends React.Component {
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
      editRole,
      deleteRole,
      onCancelRoleForm,
      classes,
    } = this.props

    return (
      <Paper className={classes.paper}>
        <RoleTable
          roles={roles}
          onAdd={addRole}
          onEdit={editRole}
          onDelete={deleteRole}
          onCancel={onCancelRoleForm}
          title="Access Control"
          headerClassname={classes.roleTableHeader}
          open={accessControlFormOpen}
          search={accessControlSearch}
          level={accessControlLevel}
          users={accessControlUsers}
          setOpen={setAccessControlFormOpen}
          setLevel={setAccessControlLevel}
          setSearch={setAccessControlSearch}
          loadUsers={loadAccessControlResults}
          clearUsers={clearAccessControlResults}
        />
      </Paper>
    )
  }

  getCreateInstructions() {
    const {
      classes,
      snackbarMessage,
      initialValues,
    } = this.props

    if (initialValues.provision_type !== 'remote') return null

    return (
      <Paper className={classes.paper} style={{ maxHeight: '792px', overflow: 'auto' }}>
        <Typography variant="h6" gutterBottom>
          Obtain Cluster Details
        </Typography>
        <Typography gutterBottom>
          You will need to have already created a cluster and have set your
          {' '}
          <b>kubectl</b>
          {' '}
          to connect to
          that cluster. In order to do this, you will need to provide
          {' '}
          <b>kubectl</b>
          {' '}
          these values:
        </Typography>
        <ul className={classes.text}>
          <li>API Server Address</li>
          <li>Access Token</li>
          <li>Certificate Authority</li>
        </ul>
        <Typography gutterBottom>
          To help you obtain these values, please follow the following steps:
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          Step 1. Create service account
        </Typography>
        <Typography gutterBottom>
          In the terminal create a shell script with the content shown below.
          Upon execution, the script will create the service account and
          assign an cluster-admin role if RBAC is enabled on your cluster.
          You can click on the copy button and transfer the
          content to your shell script (e.g.
          {' '}
          <em>create-service.sh</em>
          ).
        </Typography>
        <CodeBlock
          code={HELP_CREATE_SERVICEACCOUNT}
          clipboard
          snackbarMessage={snackbarMessage}
        />
        <Typography gutterBottom>
          Alternatively, click on the button below and download a file named
          {' '}
          <em>create-service.sh</em>
          {' '}
          containing the scripts shown above.
          Run the script after downloading.
        </Typography>
        <div className={classes.spacer} />
        <Button
          className={classes.button}
          type="button"
          variant="contained"
          onClick={() => {
            const blob = new Blob([HELP_CREATE_SERVICEACCOUNT], { type: 'text/plain;charset=utf-8' });
            saveAs(blob, 'create-service.sh');
          }}
        >
          Download file
        </Button>
        <div className={classes.spacer} />
        <Typography variant="subtitle1" gutterBottom>
          Step 2. Get credentials
        </Typography>
        <Typography gutterBottom>
          Having completed STEP 1,
          you would have created the necessary service account in your chosen cluster.
          Next execute the following script to get the api server address,
          token and certificate authority.
          You will need to create a shell script with the following content yourself.
          You can click on the copy button
          and transfer the content to the script of your choice (e.g.
          {' '}
          <em>get-values.sh</em>
          ).
        </Typography>
        <CodeBlock
          code={HELP_GET_VALUES}
          clipboard
          snackbarMessage={snackbarMessage}
        />
        <Typography gutterBottom>
          Alternatively, click on the button below and download a file named
          {' '}
          <em>get-values.sh</em>
          {' '}
          containing the scripts shown above.
          Run the script after downloading.
        </Typography>
        <div className={classes.spacer} />
        <Button
          className={classes.button}
          type="button"
          variant="contained"
          onClick={() => {
            const blob = new Blob([HELP_GET_VALUES], { type: 'text/plain;charset=utf-8' });
            saveAs(blob, 'get-values.sh');
          }}
        >
          Download file
        </Button>
        <div className={classes.spacer} />
        <Typography variant="subtitle1" gutterBottom>
          Step 3. Paste credentials
        </Typography>
        <Typography gutterBottom>
          Copy the output of the script above and paste them into the form.
        </Typography>
      </Paper>
    )
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
      validate,
    } = this.props

    return (
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={id === 'new' ? 6 : 12}>
            <Paper className={classes.paper}>
              <Typography _ci="formheader" variant="h6" gutterBottom>
                { title }
              </Typography>
              <FormWrapper
                addSpaces
                schema={schema}
                initialValues={initialValues}
                error={error}
                onSubmit={submitForm}
                validate={validate}
                renderButtons={
                  ({
                    handleSubmit,
                  }) => (
                    <React.Fragment>
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
                        className={classes.button}
                        type="button"
                        variant="contained"
                        color="primary"
                        disabled={submitting}
                        onClick={handleSubmit}
                      >
                        {id === 'new' ? 'Activate' : 'Save'}
                      </Button>
                    </React.Fragment>

                  )
                }
              />
            </Paper>
          </Grid>
          <Grid item xs={id === 'new' ? 6 : 12}>
            {
              id === 'new'
                ? this.getCreateInstructions()
                : (
                  <div>
                    {
                      this.getRoleTable()
                    }
                    <div className={classes.spacer} />
                    {
                      this.getTaskTable()
                    }
                  </div>
                )
            }
          </Grid>
        </Grid>
      </div>
    )
  }
}

ClusterForm.propTypes = {
  classes: PropTypes.object.isRequired,
  submitForm: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  title: PropTypes.string,
}

ClusterForm.defaultProps = {
  title: 'Cluster Details',
}

export default withStyles(styles)(ClusterForm)
