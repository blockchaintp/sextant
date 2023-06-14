import React, { useCallback } from 'react'
import settings from '../../settings'
import rbac from '../../utils/rbac'
import { styled } from '@mui/material/styles'
import {
  Button,
  Stepper,
  Step,
  StepConnector,
} from '@mui/material'
import { ButtonProps } from '@mui/material/Button'
import { stepConnectorClasses } from '@mui/material/StepConnector'
import TaskStatusIcon from '../../components/status/TaskStatusIcon'
import TaskActionIcon, { Action } from '../../components/status/TaskActionIcon'
import SimpleTable from '../../components/table/SimpleTable'
import SimpleTableTripleDeleteDialog from '../../components/table/SimpleTableTripleDeleteDialog'
import SimpleTableHeader from '../../components/table/SimpleTableHeader'
import SimpleTableActions from '../../components/table/SimpleTableActions'
import {
  actionNameTranslator, clusterStatusTranslator, getClusterIcon, getClusterIconTitle,
} from '../../utils/translators'

type ActionData = {
  id: number
  clusterData: Cluster
  name: string
  provision_type: string
  status: string
  task: React.JSX.Element
}

type User = {
  id: number
  username: string
  permission: string
  roles: string[]
}

type Cluster = {
  id: number
  name: string
  status: string
  provision_type: string
  task: {
    action: Action
    status: "error" | "created" | "running" | "finished"
    error: "error" | "created" | "running" | "finished" | null
  }
}

type ClusterTableProps = {
  clusters: Cluster[]
  onAdd: (value: string) => void
  onEdit: (id: number) => void
  onDelete: (id: number) => void
  viewDeployments: (id: number) => void
  onViewStatus: (id: number) => void
  user: User
}

const AddIcon = settings.icons.add
const EditIcon = settings.icons.edit
const DeploymentIcon = settings.icons.deployment
const ViewIcon = settings.icons.view

const HeaderActions = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'right',
  alignItems: 'center',
})

export interface CIButtonProps extends ButtonProps {
  _ci?: string
}

const CIButton = ({ _ci, ...rest }: CIButtonProps) => {
  return <Button {...rest} />;
}

const Connector = styled(StepConnector)(({ theme }) => ({
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.grey[300],
  },
}))

const ClusterTable: React.FC<ClusterTableProps> = ({
  clusters,
  onAdd,
  onEdit,
  onDelete,
  viewDeployments,
  onViewStatus,
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

  const fields = [{
    title: 'Name',
    name: 'name',
  }, {
    title: 'Provision Type',
    name: 'provision_type',
  }, {
    title: 'Cluster Status',
    name: 'status',
  }, {
    title: 'Task',
    name: 'task',
  }]

  function isAction(action: string): action is Action {
    return ['create', 'update', 'delete'].includes(action)
  }

  const data: ActionData[] = clusters.map((cluster) => {
    const action = cluster.task?.action.split('.')[1]
    return {
      id: cluster.id,
    clusterData: cluster,
    // role: cluster.role,
    name: cluster.name,
    provision_type: cluster.provision_type,
    status: clusterStatusTranslator(cluster.status),
    task: cluster.task ? (
      <Stepper connector={<Connector />}>
        <Step>
          <TaskActionIcon
            action={action as Action}
            actionLabel={actionNameTranslator(cluster.task.action)}
          />
        </Step>
        <Step>
          <TaskStatusIcon
            status={cluster.task.status}
            error={cluster.task.error}
          />
        </Step>
      </Stepper>
    ) : null,
    }
  })

  const canCreateCluster = rbac({
    user,
    action: {
      resource_type: 'cluster',
      method: 'create',
    },
  })

  const addCluster = () => onAdd('remote')

  const getActions = useCallback((cluster: ActionData) => {
      const buttons = []

      if (rbac({
        user,
        action: {
          resource_type: 'cluster',
          resource_id: cluster.id,
          method: 'write',
        },
      })) {
        buttons.push({
          title: getClusterIconTitle(cluster.status),
          icon: getClusterIcon(cluster.status, settings),
          handler: (item: ActionData) => openDeleteDialog(item),
        })
        buttons.push({
          title: 'Edit',
          icon: EditIcon,
          handler: (item: ActionData) => onEdit(item.id),
        })
      }

      buttons.push({
        title: 'View',
        icon: ViewIcon,
        disabled: (cluster.status === 'inactive' || cluster.status === 'error'),
        handler: (item: ActionData) => onViewStatus(item.id),
      })

      buttons.push({
        title: 'Deployments',
        icon: DeploymentIcon,
        disabled: cluster.status === 'inactive',
        handler: (item: ActionData) => viewDeployments(item.id),
      })

      return buttons
    }, [onEdit, onViewStatus, viewDeployments, user])

    const headerActions = () =>
        <HeaderActions>
          <div>
            <CIButton
              _ci="addbutton"
              id="addButton"
              variant="contained"
              color="primary"
              onClick={addCluster}
              disabled={!canCreateCluster}
            >
              Add
              <AddIcon />
            </CIButton>
          </div>
        </HeaderActions>


    const simpleTableActions = (item: ActionData) => {
      if (item.clusterData.task && item.clusterData.task.status === 'running') return null
      return (
        <SimpleTableActions
          item={item}
          actions={getActions(item)}
        />
      )
    }

  const getItemStatus = (item: ActionData) => (item.status === 'inactive' ? ' permanently' : '')

  return (
    <div id="tableHeader_Clusters">
      <SimpleTableHeader
        title="Clusters"
        getActions={headerActions}
      />
      <SimpleTable
        pagination
        data={data}
        fields={fields}
        getActions={simpleTableActions}
      />
      <SimpleTableTripleDeleteDialog
        resource={deleteConfirmItem}
        open={deleteConfirmOpen}
        resourceType="cluster"
        title={deleteConfirmItem ? `the ${deleteConfirmItem.name} cluster ${getItemStatus(deleteConfirmItem)}` : null}
        onCancel={() => closeDeleteDialog()}
        onConfirm={() => {
          closeDeleteDialog()
          onDelete(deleteConfirmItem.id)
        }}
      />
    </div>
  )
}

export default ClusterTable
