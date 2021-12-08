import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles'
import { styled } from '@mui/material/styles'

import Button from '@mui/material/Button'

import SimpleTable from 'components/table/SimpleTable'
import SimpleTableTripleDeleteDialog from 'components/table/SimpleTableTripleDeleteDialog'
import SimpleTableHeader from 'components/table/SimpleTableHeader'
import SimpleTableActions from 'components/table/SimpleTableActions'

import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector'

import TaskStatusIcon from 'components/status/TaskStatusIcon'
import TaskActionIcon from 'components/status/TaskActionIcon'

import settings from 'settings'
import rbac from 'utils/rbac'
import {
  actionNameTranslator, clusterStatusTranslator, getClusterIcon, getClusterIconTitle,
} from '../../utils/translators'

const AddIcon = settings.icons.add
const EditIcon = settings.icons.edit
const DeploymentIcon = settings.icons.deployment
const ViewIcon = settings.icons.view

const styles = (theme) => ({
  errorText: {
    color: theme.palette.error.main,
  },
  errorContainer: {
    maxWidth: '200px',
  },
  inertText: {
    color: theme.palette.grey[600],
  },
  statusContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'left',
  },
  statusIcon: {
    marginRight: theme.spacing(2),
  },
  headerActions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'right',
    alignItems: 'center',
  },
  showDeletedCheckbox: {
    marginRight: theme.spacing(2),
  },
  showDeletedLabel: {
    whiteSpace: 'nowrap',
  },
})

const Connector = styled(StepConnector)(({ theme }) => ({
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.grey[300],
  },
}));

class ClusterTable extends React.Component {
  state = {
    deleteConfirmOpen: false,
    deleteConfirmItem: null,
  }

  openDeleteDialog(item) {
    this.setState({
      deleteConfirmOpen: true,
      deleteConfirmItem: item,
    })
  }

  closeDeleteDialog() {
    this.setState({
      deleteConfirmOpen: false,
    })
  }

  render() {
    const {
      classes,
      clusters,
      onAdd,
      onEdit,
      onDelete,
      viewDeployments,
      onViewStatus,
      user,
    } = this.props

    const {
      deleteConfirmOpen,
      deleteConfirmItem,
    } = this.state

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

    const data = clusters.map((cluster) => ({
      id: cluster.id,
      clusterData: cluster,
      role: cluster.role,
      name: cluster.name,
      provision_type: cluster.provision_type,
      status: clusterStatusTranslator(cluster.status),
      task: cluster.task ? (
        <Stepper connector={<Connector />}>
          <Step>
            <TaskActionIcon
              action={cluster.task.action.split('.')[1]}
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
    }))

    const canCreateCluster = rbac({
      user,
      action: {
        resource_type: 'cluster',
        method: 'create',
      },
    })

    const addCluster = () => onAdd('remote')

    const headerActions = (
      <div className={classes.headerActions}>
        <div className={classes.addButton}>
          <Button
            _ci="addbutton"
            id="addButton"
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={addCluster}
            disabled={!canCreateCluster}
          >
            Add
            <AddIcon />
          </Button>
        </div>
      </div>
    )

    const getActions = (cluster) => {
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
          title: getClusterIconTitle(cluster.status, settings),
          icon: getClusterIcon(cluster.status, settings),
          handler: (item) => this.openDeleteDialog(item),
        })
        buttons.push({
          title: 'Edit',
          icon: EditIcon,
          handler: (item) => onEdit(item.id),
        })
      }

      buttons.push({
        title: 'View',
        icon: ViewIcon,
        disabled: (cluster.status === 'inactive' || cluster.status === 'error'),
        handler: (item) => onViewStatus(item.id),
      })

      buttons.push({
        title: 'Deployments',
        icon: DeploymentIcon,
        disabled: cluster.status === 'inactive',
        handler: (item) => viewDeployments(item.id),
      })

      return buttons
    }

    const getItemStatus = (item) => (item.status === 'inactive' ? ' permanently' : '')

    return (
      <div id="tableHeader_Clusters">
        <SimpleTableHeader
          title="Clusters"
          getActions={() => headerActions}
        />
        <SimpleTable
          pagination
          data={data}
          fields={fields}
          getActions={(item) => {
            if (item.clusterData.task && item.clusterData.task.status === 'running') return null
            return (
              <SimpleTableActions
                item={item}
                actions={getActions(item)}
              />
            )
          }}
        />
        <SimpleTableTripleDeleteDialog
          resource={deleteConfirmItem}
          open={deleteConfirmOpen}
          resourceType="cluster"
          title={deleteConfirmItem ? `the ${deleteConfirmItem.name} cluster ${getItemStatus(deleteConfirmItem)}` : null}
          clusterName={deleteConfirmItem}
          onCancel={() => this.closeDeleteDialog()}
          onConfirm={() => {
            this.closeDeleteDialog()
            onDelete(deleteConfirmItem.id)
          }}
        />
      </div>
    )
  }
}

ClusterTable.propTypes = {
  classes: PropTypes.oneOfType([PropTypes.object]).isRequired,
  clusters: PropTypes.oneOfType([PropTypes.array]).isRequired,
  onAdd: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default withStyles(styles)(ClusterTable)
