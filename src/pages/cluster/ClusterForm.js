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

const HELP_VARIABLES = `export SERVICEACCOUNT=sextant
export NAMESPACE=default
`

const HELP_CREATE_SERVICEACCOUNT = `#!/bin/bash -e

set -e

SERVICEACCOUNT=\${SERVICEACCOUNT:="sextant"}
NAMESPACE=\${NAMESPACE:="default"}

# create the service account:
echo "creating serviceaccount: $SERVICEACCOUNT in namespace $NAMESPACE"
kubectl create -n $NAMESPACE serviceaccount $SERVICEACCOUNT

# get the RBAC api versions
RBAC_API_VERSIONS=$(kubectl api-versions | grep rbac)

# If RBAC is enabled - assign cluster-admin role to service account:
if [ -n "$RBAC_API_VERSIONS" ]; then
  echo "creating clusterrolebinding: $SERVICEACCOUNT in namespace $NAMESPACE"
  kubectl create -n $NAMESPACE clusterrolebinding $SERVICEACCOUNT \
    --clusterrole=cluster-admin \
    --serviceaccount=$NAMESPACE:$SERVICEACCOUNT
fi
`

const HELP_GET_VALUES = `#!/bin/bash -e

set -e

SERVICEACCOUNT=\${SERVICEACCOUNT:="sextant"}
NAMESPACE=\${NAMESPACE:="default"}

# get the secret name for the service account:
echo "getting the secret name for serviceaccount: $SERVICEACCOUNT in namespace $NAMESPACE"
SECRETNAME=$(kubectl get -n $NAMESPACE serviceaccounts sextant -o "jsonpath={.secrets[0].name}")

# get the base64 bearer token:
echo "getting the bearer token for serviceaccount: $SERVICEACCOUNT in namespace $NAMESPACE"
BASE64_BEARER_TOKEN=$(kubectl get secret -n $NAMESPACE $SECRETNAME -o "jsonpath={.data.token}")

# get the base64 CA:
echo "getting the certificate authority for serviceaccount: $SERVICEACCOUNT in namespace $NAMESPACE"
BASE64_CA_FILE=$(kubectl get secret -n $NAMESPACE $SECRETNAME -o "jsonpath={.data['ca\.crt']}")

# get the api server address:
echo "getting the api server address"
APISERVER=$(kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}')

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
echo -n $BASE64_BEARER_TOKEN | base64 -d
echo
echo
echo "-----"
echo "ca: |"
echo "-----"
echo
echo -n $BASE64_CA_FILE | base64 -d
echo
`

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
  text: {
    fontFamily: "Roboto",
  },
  codeblock: {
    width: '100%',
    overflowX: 'auto',
  },
  roleTableHeader: {
    paddingLeft: '0px',
  },
  spacer: {
    height: theme.spacing.unit * 2,
  },
})

class ClusterForm extends React.Component {

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
      tasks,
      classes,
    } = this.props
    return (
      <Paper className={ classes.paper }>
        <RoleTable
          roles={ [] }
          onAdd={ () => {} }
          onDelete={ () => {} }
          title="Access Control"
          headerClassname={ classes.roleTableHeader }
        />
      </Paper>
    )
  }

  getCreateInstructions() {
    const {
      classes,
      snackbarMessage,
    } = this.props
    return (
      <Paper className={ classes.paper }>
        <Typography variant="h6" gutterBottom>
          Connect Remote Cluster
        </Typography>
        <Typography gutterBottom>
          To connect a remote cluster, you will need to have <b>kubectl</b> connected to it 
          and the ability to create service accounts.
        </Typography>
        <Typography gutterBottom>
          You will need to provide these values:
        </Typography>
        <ul className={ classes.text }>
          <li>API Server Address</li>
          <li>Access Token</li>
          <li>Certificate Authority</li>
        </ul>
        <Typography gutterBottom>
          You can either create a service account manually or use the following scripts:
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Step 1. Choose service account name and namespace
        </Typography>
        <Typography gutterBottom>
          Choose a service account name (default = <b>sextant</b>) and a namespace for the service account (default = <b>default</b>) we will create.
          
        </Typography>
        <CodeBlock
          code={ HELP_VARIABLES }
          clipboard={ true }
          snackbarMessage={ snackbarMessage }
        />
        <Typography variant="subtitle1" gutterBottom>
          Step 2. Create service account
        </Typography>
        <Typography gutterBottom>
          Then run this script that will create the service account and assign an cluster-admin role if RBAC is enabled on your cluster:
        </Typography>
        <CodeBlock
          code={ HELP_CREATE_SERVICEACCOUNT }
          clipboard={ true }
          snackbarMessage={ snackbarMessage }
        />
        <Typography variant="subtitle1" gutterBottom>
          Step 3. Get credentials
        </Typography>
        <Typography gutterBottom>
          Once you have the service account created - use the following script to get the api server address, token and certificate authority.
        </Typography>
        <CodeBlock
          code={ HELP_GET_VALUES }
          clipboard={ true }
          snackbarMessage={ snackbarMessage }
        />
        <Typography variant="subtitle1" gutterBottom>
          Step 4. Paste credentials
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
      submitTitle,
      submitForm,
      schema,
      initialValues,
      error,
      submitting,
      onCancel,
      validate,
      tasks,
    } = this.props

    return (
      <div className={ classes.root }>
        <Grid container spacing={24}>
          <Grid item xs={ 6 }>
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
          <Grid item xs={ 6 }>
            {
              id == 'new' ?
                this.getCreateInstructions() :
                (
                  <div>
                    {
                      this.getRoleTable()
                    }
                    <div className={ classes.spacer } />
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