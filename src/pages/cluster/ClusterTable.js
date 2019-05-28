import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'

import SimpleTable from 'components/table/SimpleTable'
import SimpleTableDeleteDialog from 'components/table/SimpleTableDeleteDialog'
import SimpleTableHeader from 'components/table/SimpleTableHeader'
import SimpleTableActions from 'components/table/SimpleTableActions'

import MenuButton from 'components/layout/MenuButton'
import TaskStatusIcon from 'components/status/TaskStatusIcon'
import TaskActionIcon from 'components/status/TaskActionIcon'

import settings from 'settings'

const AddIcon = settings.icons.add
const EditIcon = settings.icons.edit
const DeleteIcon = settings.icons.delete
const DeploymentIcon = settings.icons.deployment
const ViewIcon = settings.icons.view

const styles = theme => ({
  errorText: {
    color: theme.palette.error.main,
  },
  errorContainer: {
    maxWidth: '200px',
  },
  statusContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'left',
  },
  statusIcon: {
    marginRight: theme.spacing.unit * 2,
  },
  headerActions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'right',
    alignItems: 'center',
  },
  showDeletedCheckbox: {
    marginRight: theme.spacing.unit * 2,
  },
  showDeletedLabel: {
    whiteSpace: 'nowrap',
  },
})

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
      showDeleted,
      onAdd,
      onEdit,
      onDelete,
      updateShowDeleted,
      viewDeployments,
      onViewStatus,
    } = this.props

    const {
      deleteConfirmOpen,
      deleteConfirmItem,
    } = this.state

    const fields =[{
      title: 'Name',
      name: 'name',
    },{
      title: 'Provision Type',
      name: 'provision_type',
    },{
      title: 'Cluster Status',
      name: 'status',
    }, {
      title: 'Task',
      name: 'task',
    }, {
      title: 'Task Status',
      name: 'task_status',
    }]

    const data = clusters.map((cluster, index) => {
      return {
        id: cluster.id,
        clusterData: cluster,
        name: cluster.name,
        provision_type: cluster.provision_type,
        status: cluster.status,
        task: cluster.task ? (
          <div className={ classes.statusContainer }>
            <div className={ classes.statusIcon }>
              <TaskActionIcon
                action={ cluster.task.action.split('.')[1] }
              />
            </div>
            <div>
              { cluster.task.action }
            </div>
          </div>
        ) : null,
        task_status: cluster.task ? (
          <div className={ classes.statusContainer }>
            <div className={ classes.statusIcon }>
              <TaskStatusIcon
                status={ cluster.task.status }
              />
            </div>
            <div>
              { !cluster.task.error && cluster.task.status }
              {
                cluster.task.error && (
                  <div className={ classes.errorContainer }>
                    <span className={ classes.errorText }>
                      { cluster.task.error }
                    </span>
                  </div>
                )
              }
            </div>
          </div>
        ) : null,
      }
    })

    const addButtonItems = [{
      title: 'Remote Cluster',
      handler: () => onAdd('remote')
    }, {
      title: 'Local Cluster',
      handler: () => onAdd('local')
    }]

    const headerActions = (
      <div className={ classes.headerActions }>
        <div className={ classes.showDeletedCheckbox }>
          <FormControlLabel
            control={
              <Checkbox
                checked={ showDeleted }
                onChange={ (event) => updateShowDeleted(event.target.checked) }
                value="checkedB"
                color="primary"
              />
            }
            label="Show Deleted?"
            classes={{
              label: classes.showDeletedLabel,
            }}
          />
        </div>
        <div className={ classes.addButton }>
          <MenuButton 
            className={classes.button} 
            title="Add"
            icon={ AddIcon }
            buttonProps={{
              variant: 'contained',
              color: 'secondary',
            }}
            items={ addButtonItems }
          />
        </div>
      </div>
    )

    const getActions = (item) => {
      const baseActions = [{
        title: 'Delete',
        icon: DeleteIcon,
        handler: (item) => this.openDeleteDialog(item),
      }, {
        title: 'Edit',
        icon: EditIcon,
        handler: (item) => onEdit(item.id),
      }, {
        title: 'View',
        icon: ViewIcon,
        handler: (item) => onViewStatus(item.id),
      }, {
        title: 'Deployments',
        icon: DeploymentIcon,
        handler: (item) => viewDeployments(item.id),
      }]

      return baseActions
    }

    return (
      <div>
        <SimpleTableHeader
          title='Clusters'
          getActions={ () => headerActions }
        />
        <SimpleTable
          data={ data }
          fields={ fields }
          getActions={ (item) => {
            if(item.clusterData.task && item.clusterData.task.status == 'running') return null
            return (
              <SimpleTableActions
                item={ item }
                actions={ getActions(item) }
              />
            )
          }}
        />
        <SimpleTableDeleteDialog
          open={ deleteConfirmOpen }
          title={ deleteConfirmItem ? `the ${deleteConfirmItem.name} cluster ${deleteConfirmItem.status == 'deleted' ? ' - this will be permenant' : ''}` : null }
          onCancel={ () => this.closeDeleteDialog() }
          onConfirm={ () => {
            this.closeDeleteDialog()
            onDelete(deleteConfirmItem.id)
          }}
        />
      </div>
    )
  }
}

ClusterTable.propTypes = {
  classes: PropTypes.object.isRequired,
  clusters: PropTypes.array.isRequired,
  onAdd: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default withStyles(styles)(ClusterTable)

