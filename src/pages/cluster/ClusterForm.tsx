import * as React from 'react'
import { styled } from '@mui/system'
import {
  Paper,
  Grid,
  Typography,
  Button,
} from '@mui/material'
import { ButtonProps } from '@mui/material/Button'
import { TypographyProps } from '@mui/material/Typography'
import { User } from '../role/RoleForm'
import RoleTable from '../role/RoleTable'
import TaskTable from '../../components/task/TaskTable'
import CodeBlock from '../../components/code/CodeBlock'
import FormWrapper from '../../components/form/Wrapper'

import saveAs from 'file-saver'

const HELP_CREATE_SERVICEACCOUNT = `#!/bin/bash -e

set -e

SERVICEACCOUNT="sextant"
NAMESPACE="default"

# Determine kubernetes server version
minor_version=$(kubectl version --output=yaml | awk '/serverVersion:/ { getline; while ($0 ~ /^[[:blank:]]/) { if ($0 ~ /minor:/) { split($0, a, ":"); gsub(/^[[:blank:]]+/, "", a[2]); print a[2]; exit } getline } }' | tr -d '"')

# Remove '+' from the minor version
minor_version=\${minor_version%"+"}

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

if (( minor_version > 23 )); then
  kubectl -n $NAMESPACE create -f - <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: sextant-token
  annotations:
    kubernetes.io/service-account.name: sextant
type: kubernetes.io/service-account-token
EOF

fi
`

const HELP_GET_VALUES = `#!/bin/bash -e

set -e

SERVICEACCOUNT="sextant"
NAMESPACE="default"

# Determine kubernetes server version
minor_version=$(kubectl version --output=yaml | awk '/serverVersion:/ { getline; while ($0 ~ /^[[:blank:]]/) { if ($0 ~ /minor:/) { split($0, a, ":"); gsub(/^[[:blank:]]+/, "", a[2]); print a[2]; exit } getline } }' | tr -d '"')

# Remove '+' from the minor version
minor_version=\${minor_version%"+"}

if (( minor_version <= 23 )); then
  # get the secret name for the service account:
  echo "getting the secret name for serviceaccount: $SERVICEACCOUNT in namespace $NAMESPACE"
  SECRETNAME=$(kubectl get -n $NAMESPACE serviceaccounts sextant -o "jsonpath={..secrets[0].name}")
else
  SECRETNAME="sextant-token"
fi

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

const Root = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
}))

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
}))

const StyledButton = styled(Button)(({ theme }) => ({
  marginRight: theme.spacing(2),
}))

const StyledUl = styled('ul')({
  fontFamily: 'Roboto',
})

const Spacer = styled('div')(({ theme }) => ({
  height: theme.spacing(2),
}))

export interface CIButtonProps extends ButtonProps {
  _ci?: string
}

const CIButton = ({ _ci, ...rest }: CIButtonProps) => {
  return <StyledButton {...rest} />;
}

export interface CITypographyProps extends TypographyProps {
  _ci?: string
}

const CITypography = ({ _ci, ...rest }: CITypographyProps) => {
  return <Typography {...rest} />
}

type Field = {
  component: string
  helperText: string
  id: string
  title: string
  validate: {
    methods: [string, string] | [string, string, string] | [string, number, string]
  }[]
}

type Role = {
  id: number
  permission: string
  resource_id: number
  resource_type: string
  user: number
  userRecord: {
    id: number
    username: string
    permission: string
  }
}

type ActionData = {
  id: string
  started_at: string
  action: any
  status: "created" | "running" | "finished" | "error"
  error: string
}

type Task = {
  started_at: string
  action: string
  error: string
  id: string
  resource_id: number
  resource_status: {
    completed: string
    error: string
  }
  resource_type: string
  status: "created" | "running" | "finished" | "error"
  user: number
}

type ClusterFormProps = {
  tasks: Task[]
  roles: Role[]
  userList: User[]
  accessControlFormOpen: boolean
  accessControlSearch: string
  accessControlLevel: string
  accessControlUsers: []
  setAccessControlFormOpen: () => void
  setAccessControlLevel: () => void
  setAccessControlSearch: () => void
  loadAccessControlResults: () => void
  clearAccessControlResults: () => void
  addRole:() => void
  editRole:() => void
  deleteRole:() => void
  onCancelRoleForm:() => void
  snackbarMessage:() => void
  initialValues: {
    provision_type: string
    [key: string]: string | number | boolean
  }
  id: string | number
  title: string
  submitForm:() => void
  schema: Field[]
  error: string | undefined
  submitting: undefined | boolean
  onCancel:() => void
  validate: unknown
}

const ClusterForm: React.FC<ClusterFormProps> = ({
  tasks,
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
  editRole,
  deleteRole,
  onCancelRoleForm,
  snackbarMessage,
  initialValues,
  id,
  title='Cluster Details',
  submitForm,
  schema,
  error,
  submitting,
  onCancel,
  validate,
}) => {
  const getTaskTable = () => {
    const tableData: ActionData[] = tasks.map((task) => {
      const taskId = task.id.toString()
      return (
        {
          id: taskId,
          started_at: task.started_at,
          action: task.action,
          status: task.status,
          error: task.error,
        }
      )})
    return (
      <StyledPaper>
        <Typography variant="h6" gutterBottom>
          Tasks
        </Typography>
        <TaskTable
          data={tableData}
        />
      </StyledPaper>
    )
  }

  const getRoleTable = () => {
    return (
      <StyledPaper>
        <RoleTable
          roles={roles}
          onAdd={addRole}
          onEdit={editRole}
          onDelete={deleteRole}
          onCancel={onCancelRoleForm}
          title="Access Control"
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
      </StyledPaper>
    )
  }

  const getCreateInstructions = () => {
    if (initialValues.provision_type !== 'remote') return null

    return (
      <StyledPaper style={{ maxHeight: '792px', overflow: 'auto' }}>
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
        <StyledUl>
          <li>API Server Address</li>
          <li>Access Token</li>
          <li>Certificate Authority</li>
        </StyledUl>
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
        <Spacer />
        <CIButton
          id="downloadcreateserviceaccount"
          type="button"
          variant="contained"
          onClick={() => {
            const blob = new Blob([HELP_CREATE_SERVICEACCOUNT], { type: 'text/plain;charset=utf-8' });
            saveAs(blob, 'create-service.sh');
          }}
        >
          Download file
        </CIButton>
        <Spacer />
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
        <Spacer />
        <CIButton
          id="downloadgetvalues"
          type="button"
          variant="contained"
          onClick={() => {
            const blob = new Blob([HELP_GET_VALUES], { type: 'text/plain;charset=utf-8' });
            saveAs(blob, 'get-values.sh');
          }}
        >
          Download file
        </CIButton>
        <Spacer />
        <Typography variant="subtitle1" gutterBottom>
          Step 3. Paste credentials
        </Typography>
        <Typography gutterBottom>
          Copy the output of the script above and paste them into the form.
        </Typography>
      </StyledPaper>
    )
  }

  return (
    <Root>
      <Grid container spacing={3}>
        <Grid item xs={id === 'new' ? 6 : 12}>
          <StyledPaper>
            <CITypography _ci="formheader" id="formheader" variant="h6" gutterBottom>
              { title }
            </CITypography>
            <FormWrapper
              addSpaces
              schema={schema}
              initialValues={initialValues}
              error={error}
              onSubmit={submitForm}
              validate={validate}
              renderButtons={
                ({ handleSubmit }: { handleSubmit: () => void }) => (
                  <>
                    {
                      onCancel && (
                        <CIButton
                          type="button"
                          variant="contained"
                          onClick={onCancel}
                          id="cancelButton"
                        >
                          Cancel
                        </CIButton>
                      )
                    }
                    <CIButton
                      _ci="submitButton"
                      id="submitButton"
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={submitting}
                      onClick={handleSubmit}
                    >
                      {id === 'new' ? 'Activate' : 'Save'}
                    </CIButton>
                  </>
                )
              }
            />
          </StyledPaper>
        </Grid>
        <Grid item xs={id === 'new' ? 6 : 12}>
          {
            id === 'new'
              ? getCreateInstructions()
              : (
                <div>
                  {
                    getRoleTable()
                  }
                  <Spacer />
                  {
                    getTaskTable()
                  }
                </div>
              )
          }
        </Grid>
      </Grid>
    </Root>
  )
}

export default ClusterForm
