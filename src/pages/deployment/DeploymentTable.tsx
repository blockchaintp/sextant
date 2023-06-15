/* eslint-disable max-len */
import React, { useCallback } from 'react'
import { styled } from '@mui/material/styles'

import {
  FormControlLabel,
  FormControl,
  InputLabel,
  Checkbox,
  Select,
  MenuItem,
  Step,
  Stepper
} from '@mui/material'
import { FormControlProps } from '@mui/material/FormControl'
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector'

import SimpleTable from '../../components/table/SimpleTable'
import SimpleTableTripleDeleteDialog from '../../components/table/SimpleTableTripleDeleteDialog'
import SimpleTableHeader from '../../components/table/SimpleTableHeader'
import SimpleTableActions from '../../components/table/SimpleTableActions'

import RedirectButton from '../../components/layout/RedirectButton'
import TaskStatusIcon from '../../components/status/TaskStatusIcon'
import TaskActionIcon, { Action } from '../../components/status/TaskActionIcon'

import settings from '../../settings'

import rbac from '../../utils/rbac'
import { getFirstTagForDeployment } from '../../utils/deployment_settings_page'

import {
  actionNameTranslator,
  deploymentStatusTranslator,
  getDeploymentIcon,
  getDeploymentIconTitle,
} from '../../utils/translators'

const AddIcon = settings.icons.add
const EditIcon = settings.icons.edit
const ViewIcon = settings.icons.view
const SettingsIcon = settings.icons.settings
const EmptyIcon = settings.icons.settings

const HeaderActions = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'right',
  alignItems: 'center',
})

const ClusterSelect = styled('div')(({ theme }) => ({
  marginRight: theme.spacing(2),
}))

const HideDeletedCheckbox = styled('div')(({ theme }) => ({
  marginRight: theme.spacing(2),
}))

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  margin: theme.spacing(1),
  minWidth: 200,
}))

interface CIFormControlProps extends FormControlProps {
  _ci?: string
}

const CIFormControl = ({ _ci, ...rest }: CIFormControlProps) => {
  return <StyledFormControl {...rest} />
}

const Connector = styled(StepConnector)(({ theme }) => ({
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.grey[300],
  },
}))

type ActionData = {
  id: number
  cluster: number
  deploymentData: Deployment
  name: string
  deployment_type: string
  status: string
  task: React.JSX.Element
}

type Cluster = {
  id: string
  name: string
  status: string
  provision_type: string
  task: {
    action: Action
    status: "error" | "created" | "running" | "finished"
    error: "error" | "created" | "running" | "finished" | null
  }
}

type Deployment = {
  id: number
  cluster: number
  name: string
  clusterName: string
  deployment_type: string
  deployment_version: string
  deployment_method: string
  status: string
  task: {
    action: string
    status: "error" | "created" | "running" | "finished"
    error: "error" | "created" | "running" | "finished" | null
  }
}

type DeploymentTableProps = {
  deployments: Deployment[]
  onClickAddButton: () => void
  onAdd: (clusterId: string, deploymentType: string, versionForm: string) => void
  onEdit: (cluster: unknown, id: number) => void
  onViewStatus: (cluster: unknown, id: number) => void
  onViewSettings: (
    cluster: unknown,
    id: number,
    deployment_type: string,
    deployment_version: string,
    pageKey: string,
  ) => void
  onDelete: (clusterId: string, deploymentId: number) => void
  updateHideDeleted: (checked: boolean) => void
  clusters: Cluster[]
  cluster: Cluster
  clusterId: string
  updateClusterId: (value: string) => void
  deploymentForms: {
    [key: string]: {
      button: {
        versions: {
          description: string
          features: string | null
          form: string
          icon: string
          title: string
          version: string
        }[]
      }
      order: number

    }
  }
  embedded: boolean
  user: {}
}

const DeploymentTable: React.FC<DeploymentTableProps> = ({
  deployments,
  onClickAddButton,
  onAdd,
  onEdit,
  onViewStatus,
  onViewSettings,
  onDelete,
  updateHideDeleted,
  clusters,
  cluster,
  clusterId,
  updateClusterId,
  deploymentForms,
  embedded,
  user,
}) => {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false)
  const [deleteConfirmItem, setDeleteConfirmItem] = React.useState<ActionData | null>(null)

  const openDeleteDialog = (item: ActionData) => {
    setDeleteConfirmOpen(true)
    setDeleteConfirmItem(item)
  }

  const closeDeleteDialog = () => {
    setDeleteConfirmOpen(false)
  }

  let fields = [
    {
      title: 'Name',
      name: 'name',
    },
    {
      title: 'Cluster',
      name: 'clusterName',
    },
    {
      title: 'Type',
      name: 'deployment_type',
    },
    {
      title: 'Status',
      name: 'status',
    },
    {
      title: 'Task',
      name: 'task',
    },
  ]

  if (embedded) {
    fields = fields.filter((f) => f.name !== 'clusterName')
  }

  const data: ActionData[] = deployments.map((deployment) => {
    const action = deployment.task?.action.split('.')[1]
    return {
      id: deployment.id,
      cluster: deployment.cluster,
      deploymentData: deployment,
      name: deployment.name,
      clusterName: deployment.clusterName,
      deployment_type: deployment.deployment_type,
      status: deploymentStatusTranslator(deployment.status),
      task: deployment.task ? (
        <Stepper activeStep={1} connector={<Connector />}>
          <Step>
            <TaskActionIcon
              action={action as Action}
              actionLabel={actionNameTranslator(deployment.task.action)}
            />
          </Step>
          <Step>
            <TaskStatusIcon
              status={deployment.task.status}
              error={deployment.task.error}
            />
          </Step>
        </Stepper>
      ) : null,
    }
  })

  // holds an array of deployment types
  const addButtonItems = Object.keys(deploymentForms).map((deploymentType) => {
      const formConfig = deploymentForms[deploymentType]
      // versions is an array of objects.
      // Each object contains data for a version of the deploymentType
      return {
        order: formConfig.order,
        versions: formConfig.button.versions.map((version) => ({
          icon: version.icon,
          title: version.title,
          version: version.version,
          description: version.description,
          handler: () => onAdd(clusterId, deploymentType, version.form),
        })),
      }
    },
  )
  // remove charts that are not helm charts
  const helmAddButtonItems = addButtonItems.filter((item) => item.order >= 0)

  // sort the helm charts beased on the order value
  helmAddButtonItems.sort((a, b) => (a.order > b.order ? 1 : -1))

  let addButtonDisabled = true

  if (clusterId !== 'all') {
    const canWriteToCluster = rbac({
      user,
      action: {
        resource_type: 'cluster',
        resource_id: clusterId,
        method: 'write',
      },
    })

    addButtonDisabled = !canWriteToCluster
  }

  const addButton = (
    <div>
      <RedirectButton
        cluster={clusterId}
        onClick={onClickAddButton}
        title="Add"
        icon={AddIcon}
        buttonProps={{
          variant: 'contained',
          color: 'primary',
        }}
        items={helmAddButtonItems}
        disabled={addButtonDisabled}
      />
    </div>
  )

  const headerActions = embedded ? (
    <HeaderActions>
      <HideDeletedCheckbox>
        <FormControlLabel
          control={(
            <Checkbox
              onChange={(e) => updateHideDeleted(e.target.checked)}
              value="checkedB"
              color="primary"
            />
          )}
          label="Hide Undeployed"
          sx={{
            whiteSpace: 'nowrap'
          }}
        />
      </HideDeletedCheckbox>
      {addButton}
    </HeaderActions>
  ) : (
    <HeaderActions>
      <ClusterSelect>
        <CIFormControl variant="standard" _ci="formControl">
          <InputLabel htmlFor="name-readonly">Cluster</InputLabel>
          <Select
            value={clusterId}
            onChange={(e) => updateClusterId(e.target.value)}
          >
            {[
              {
                id: 'all',
                name: 'all',
              },
            ]
              .concat(clusters)
              .map((eachCluster) => (
                <MenuItem key={eachCluster.id} value={eachCluster.id}>
                  {eachCluster.name}
                </MenuItem>
              ))}
          </Select>
        </CIFormControl>
      </ClusterSelect>
      {addButton}
    </HeaderActions>
  )

  const getActions = useCallback((deployment: ActionData) => {
    const buttons = []

    if (rbac({
        user,
        action: {
          resource_type: 'deployment',
          resource_id: deployment.id,
          method: 'write',
        },
      })) {
      buttons.push({
        title: getDeploymentIconTitle(deployment.status),
        icon: getDeploymentIcon(deployment.status, settings),
        handler: (item: ActionData) => openDeleteDialog(item),
      })
      buttons.push({
        title: 'Edit',
        icon: EditIcon,
        handler: (item: ActionData) => onEdit(item.cluster, item.id),
      })
    }

    buttons.push({
      title: 'View',
      icon: ViewIcon,
      disabled: deployment.status === 'undeployed',
      handler: (item: ActionData) => onViewStatus(item.cluster, item.id),
    })

    const undeployed = deployment.status !== 'deployed'
    // eslint-disable-next-line camelcase
    const { deployment_type } = deployment
    const deploymentsWithSettings = [
      'daml-on-sawtooth',
      'daml-on-besu',
      'daml-on-qldb',
      'daml-on-postgres',
      'tfs-on-sawtooth',
    ]

    if (deploymentsWithSettings.includes(deployment_type)) {
      buttons.push({
        title: 'Settings',
        icon: SettingsIcon,
        disabled: undeployed,
        handler: (item: ActionData) => {
          const pageKey = getFirstTagForDeployment(
            deploymentForms,
            item.deployment_type,
            item.deploymentData.deployment_version,
          )
          return onViewSettings(
            item.cluster,
            item.id,
            item.deployment_type,
            item.deploymentData.deployment_version,
            pageKey,
          )
        },
      })
    } else {
      buttons.push({
        title: 'Empty',
        icon: EmptyIcon,
        disabled: true,
        className: 'emptyIcon',
        style: { opacity: 0 },
      })
    }
    return buttons
  }, [onEdit, onViewSettings, onViewStatus, user])

  const getItemStatus = (item: ActionData) => (item.status === 'undeployed' ? ' permanently' : '')

  const clusterTitle = cluster
    ? `${cluster.name}: Deployments`
    : 'Deployments'
  const title = embedded ? 'Deployments' : clusterTitle

  const simpleTableHeaderActions = () => headerActions

  const simpleTableActions = (item: ActionData) => {
    if ( item.deploymentData.task && item.deploymentData.task.status === 'running') return null
    return (
      <SimpleTableActions
        item={item}
        actions={getActions(item)}
      />
    )
  }

  return (
    <div>
      <SimpleTableHeader
        title={title}
        getActions={simpleTableHeaderActions}
        sx={{
          paddingLeft: (embedded && '0px'),
        }}
      />
      <SimpleTable
        pagination
        data={data}
        fields={fields}
        getActions={simpleTableActions}
      />
      <SimpleTableTripleDeleteDialog
        resourceType="deployment"
        resource={deleteConfirmItem}
        open={deleteConfirmOpen}
        title={
          deleteConfirmItem
            ? `the ${deleteConfirmItem.name} deployment ${getItemStatus(
              deleteConfirmItem,
            )}`
            : null
        }
        onCancel={() => closeDeleteDialog()}
        onConfirm={() => {
          closeDeleteDialog()
          onDelete(clusterId, deleteConfirmItem.id)
        }}
      />
    </div>
  )
}

export default DeploymentTable
