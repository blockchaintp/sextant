/* eslint-disable react/no-unused-state */
/* eslint-disable react/jsx-fragments */
import * as React from 'react'
import { styled } from '@mui/system'
import {
  Paper,
  Grid,
  Typography,
  Button,
} from '@mui/material'
import { TypographyProps } from '@mui/material/Typography'
import { ButtonProps } from '@mui/material/Button'

import RoleTable from '../role/RoleTable'
import { User } from '../role/RoleForm'

import TaskTable, { TaskTableProps } from '../../components/task/TaskTable'
import FormWrapper from '../../components/form/Wrapper'
import CustomizationPanel from '../../components/deployment/CustomizationPanel'

type DeploymentFormProps = {
  roles: []
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
  addRole: () => void
  deleteRole: () => void
  editRole: () => void
  onCancelRoleForm: () => void
  id: string
  title: string
  submitForm: () => void
  schema: unknown
  initialValues: unknown
  error: string | undefined
  submitting: boolean | undefined
  tasks: TaskTableProps['data']
  onCancel: () => void
  clusterId: string
  validate: () => void
  exists: boolean
  saveYamlInput: (input: string) => void
  yamlInput: number
  customYaml: string
}

const Root = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
}))

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
}))

const Panel = styled('div')(({ theme }) => ({
  width: '49.2%',
  marginBottom: theme.spacing(2),
}))

const Spacer = styled('div')(({ theme }) => ({
  height: theme.spacing(6),
}))

const StyledButton = styled(Button)(({ theme }) => ({
  marginRight: theme.spacing(2),
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

// this is here to prevent the bug sxt-985
function handleDocumentKeyDown(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
  }
}

document.addEventListener('keydown', handleDocumentKeyDown);

const DeploymentForm: React.FC<DeploymentFormProps> = ({
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
  id,
  title = "Deployment Details",
  submitForm,
  schema,
  initialValues,
  error,
  submitting,
  tasks,
  onCancel,
  clusterId,
  validate,
  exists,
  saveYamlInput,
  yamlInput,
  customYaml,
}) => {
  const [_input, setInput] = React.useState('')
  const getTaskTable = () => {
    return (
      <StyledPaper>
        <Typography variant="h6" gutterBottom>
          Tasks
        </Typography>
        <TaskTable
          data={tasks}
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
          onDelete={deleteRole}
          onEdit={editRole}
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

  const inputToState = (payload: React.SetStateAction<string>) => {
    setInput(payload)
  }

  return (
    <Root>
      <Grid container spacing={3}>
        {
        id !== 'new' && (
          <Grid item xs={12}>
            <div>
              {
                getRoleTable()
              }
              <Spacer />
              {
                getTaskTable()
              }
            </div>
          </Grid>
        )
      }
        <Grid item xs={12}>
          <Paper sx={{
            ...(id === 'new'
              ? { padding: 5 }
              : {
                padding: 5,
                height: '68vh',
                overflow: 'auto',
              }
            ),
          }}
          >
            <CITypography _ci="formheader" id="formheader" variant="h6" gutterBottom>
              { title }
            </CITypography>
            <FormWrapper
              schema={schema}
              initialValues={initialValues}
              error={error}
              onSubmit={submitForm}
              validate={validate}
              exists={exists}
              renderButtons={
                ({ handleSubmit }: { handleSubmit: () => void }) => {
                  const yamlInputNumber = yamlInput.toString()
                  return (
                    <>
                      <Panel>
                        <CustomizationPanel
                          inputToState={inputToState}
                          saveYamlInput={saveYamlInput}
                          customYaml={customYaml}
                          yamlInput={yamlInputNumber}
                        />
                      </Panel>
                      <Spacer />
                      {
                        onCancel && (
                          <CIButton
                            _ci="cancelBttn"
                            type="button"
                            variant="contained"
                            onClick={() => onCancel()}
                          >
                            Cancel
                          </CIButton>
                        )
                      }
                      <CIButton
                        _ci="deployBttn"
                        type="button"
                        variant="contained"
                        color="primary"
                        disabled={submitting}
                        onClick={handleSubmit}
                      >
                        {id === 'new' ? 'deploy' : 're-deploy' }
                      </CIButton>
                    </>
                  )
                }
              }
            />
          </Paper>
        </Grid>
      </Grid>
    </Root>
  )
}

export default DeploymentForm
