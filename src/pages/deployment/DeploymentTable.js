import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import Checkbox from '@material-ui/core/Checkbox'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

import SimpleTable from 'components/table/SimpleTable'
import SimpleTableDeleteDialog from 'components/table/SimpleTableDeleteDialog'
import SimpleTableHeader from 'components/table/SimpleTableHeader'
import SimpleTableActions from 'components/table/SimpleTableActions'

import MenuButton from 'components/layout/MenuButton'
import TaskStatusIcon from 'components/status/TaskStatusIcon'
import TaskActionIcon from 'components/status/TaskActionIcon'

import settings from 'settings'

import rbac from 'utils/rbac'

const AddIcon = settings.icons.add
const EditIcon = settings.icons.edit
const DeleteIcon = settings.icons.delete
const ViewIcon = settings.icons.view
const SettingsIcon = settings.icons.settings

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
  clusterSelect: {
    marginRight: theme.spacing.unit * 2,
  },
  showDeletedCheckbox: {
    marginRight: theme.spacing.unit * 2,
  },
  showDeletedLabel: {
    whiteSpace: 'nowrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 200,
  },
  embeddedHeader: {
    paddingLeft: '0px',
  },
})

class DeploymentTable extends React.Component {

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
      deployments,
      showDeleted,
      onAdd,
      onEdit,
      onViewStatus,
      onViewSettings,
      onDelete,
      updateShowDeleted,
      clusters,
      cluster,
      clusterId,
      updateClusterId,
      deploymentForms,
      embedded,
      user,
    } = this.props

    const {
      deleteConfirmOpen,
      deleteConfirmItem,
    } = this.state

    const fields =[{
      title: 'Name',
      name: 'name',
    },{
      title: 'Cluster',
      name: 'clusterName',
    },{
      title: 'Type',
      name: 'deployment_type',
    },{
      title: 'Status',
      name: 'status',
    }, {
      title: 'Task',
      name: 'task',
    }]

    const data = deployments.map((deployment, index) => {
      return {
        id: deployment.id,
        cluster: deployment.cluster,
        deploymentData: deployment,
        role: deployment.role,
        name: deployment.name,
        clusterName: deployment.clusterName,
        deployment_type: deployment.deployment_type,
        status: deployment.status,
        task: deployment.task ? (
          <div className={ classes.statusContainer }>
            <div className={ classes.statusIcon }>
              <TaskActionIcon
                action={ deployment.task.action.split('.')[1] }
              />
            </div>
            <div className={ classes.statusIcon }>
              { deployment.task.action }
            </div>
            <div className={ classes.statusIcon }>
              <TaskStatusIcon
                status={ deployment.task.status }
              />
            </div>
            <div>
              { !deployment.task.error && deployment.task.status }
              {
                deployment.task.error && (
                  <div className={ classes.errorContainer }>
                    <span className={ classes.errorText }>
                      { deployment.task.error }
                    </span>
                  </div>
                )
              }
            </div>
          </div>
        ) : null,
      }
    })

    const addButtonItems = Object.keys(deploymentForms).map(deploymentType => {

      const formConfig = deploymentForms[deploymentType]

      return {
        title: formConfig.button.title,
        items: formConfig.button.versions.map(version => ({
          title: version.title,
          handler: () => onAdd(clusterId, deploymentType, version.form),
        }))
      }
    })

    let addButtonDisabled = true

    if(clusterId != 'all') {
      const canWriteToCluster = rbac({
        user,
        action: {
          resource_type: 'cluster',
          resource_id: clusterId,
          method: 'write',
        }
      })

      addButtonDisabled = canWriteToCluster ? false : true
    }

    const addButton = (
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
          disabled={ addButtonDisabled }
        />
      </div>
    )

    const headerActions = embedded ? 
      addButton : 
      (
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
          <div className={ classes.clusterSelect }>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="name-readonly">Cluster</InputLabel>
              <Select
                value={ clusterId }
                onChange={ (ev) => updateClusterId(ev.target.value) }
              >
                {
                  [{
                    id: 'all',
                    name: 'all',
                  }].concat(
                    clusters
                      .filter(cluster => cluster.status == 'provisioned')
                  )
                    .map((cluster, i) => {
                      return (
                        <MenuItem 
                          key={ i }
                          value={ cluster.id }
                        >
                          { cluster.name }
                        </MenuItem>
                      )
                    })
                }
              </Select>
            </FormControl>
          </div>
          { addButton }
        </div>
      )

    const getActions = (deployment) => {
      const buttons = []
      if(rbac({
        user,
        action: {
          resource_type: 'deployment',
          resource_id: deployment.id,
          method: 'write',
        }
      })) {
        buttons.push({
          title: 'Delete',
          icon: DeleteIcon,
          handler: (item) => this.openDeleteDialog(item),
        })
        buttons.push({
          title: 'Edit',
          icon: EditIcon,
          handler: (item) => onEdit(item.cluster, item.id),
        })
      }

      buttons.push({
        title: 'View',
        icon: ViewIcon,
        handler: (item) => onViewStatus(item.cluster, item.id),
      })

      buttons.push({
        title: 'Settings',
        icon: SettingsIcon,
        handler: (item) => onViewSettings(item.cluster, item.id),
      })

      return buttons
    }

    const title = embedded ? 
      `Deployments` : 
      cluster ? cluster.name + ': Deployments' : 'Deployments'

    return (
      <div>
        <SimpleTableHeader
          title={ title }
          getActions={ () => headerActions }
          className={ embedded ? classes.embeddedHeader : null }
        />
        <SimpleTable
          data={ data }
          fields={ fields }
          getActions={ (item) => {
            if(item.deploymentData.task && item.deploymentData.task.status == 'running') return null
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
          title={ deleteConfirmItem ? `the ${deleteConfirmItem.name} deployment ${deleteConfirmItem.status == 'deleted' ? ' - this will be permenant' : ''}` : null }
          onCancel={ () => this.closeDeleteDialog() }
          onConfirm={ () => {
            this.closeDeleteDialog()
            onDelete(clusterId, deleteConfirmItem.id)
          }}
        />
      </div>
    )
  }
}

DeploymentTable.propTypes = {
  classes: PropTypes.object.isRequired,
  deployments: PropTypes.array.isRequired,
  onAdd: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default withStyles(styles)(DeploymentTable)

