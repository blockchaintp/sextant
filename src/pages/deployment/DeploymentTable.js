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

import DialogButton from 'components/layout/DialogButton'
import TaskStatusIcon from 'components/status/TaskStatusIcon'
import TaskActionIcon from 'components/status/TaskActionIcon'

import settings from 'settings'
import { friendlyNameGenerator, deploymentStatusTranslator, getDeploymentIcon, getDeploymentIconTitle } from '../../utils/friendlyFunctions'


import rbac from 'utils/rbac'
import { getFirstTagForDeployment, getFeaturesForDeployment } from 'utils/deployment_settings_page'

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
  hideDeletedCheckbox: {
    marginRight: theme.spacing.unit * 2,
  },
  hideDeletedLabel: {
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
      hideDeleted,
      onAdd,
      onEdit,
      onViewStatus,
      onViewSettings,
      onDelete,
      updatehideDeleted,
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

    let fields =[{
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

    if(embedded) {
      fields = fields.filter(f => f.name != 'clusterName')
    }

    const data = deployments.map((deployment, index) => {
      return {
        id: deployment.id,
        cluster: deployment.cluster,
        deploymentData: deployment,
        role: deployment.role,
        name: deployment.name,
        clusterName: deployment.clusterName,
        deployment_type: deployment.deployment_type,
        status: deploymentStatusTranslator(deployment.status),
        task: deployment.task ? (
          <div className={ classes.statusContainer }>
            <div className={ classes.statusIcon }>
              <TaskActionIcon
                action={ deployment.task.action.split('.')[1] }
              />
            </div>
            <div className={ classes.statusIcon }>
              { friendlyNameGenerator(deployment.task.action) }
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

    // holds an array of deployment types
    const addButtonItems = Object.keys(deploymentForms).map(deploymentType => {
      const formConfig = deploymentForms[deploymentType]
      // versions is an array of objects. Each object contains data for a version of the deploymentType
      return {
        versions: formConfig.button.versions.map(version => ({
          icon: version.icon,
          title: version.title,
          version: version.version,
          description: version.description,
          handler: () => onAdd(clusterId, deploymentType, version.form),
        })),
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

    const noActiveDeployments = () => {
      if(cluster){
        const active_deployments = parseInt(cluster.active_deployments, 10)
        return active_deployments > 0 ? false : true
      } else {
        return false
      }
    }

      addButtonDisabled = (canWriteToCluster && noActiveDeployments()) ? false : true
    }

    const addButton = (
      <div className={ classes.addButton }>
        <DialogButton
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
      (
        <div className={classes.headerActions}>
        < div className = { classes.hideDeletedCheckbox } >
          <FormControlLabel
            control={
              <Checkbox
                onChange={(event) => updatehideDeleted(event.target.checked)}
                value="checkedB"
                color="primary"
              />
            }
            label="Hide Undeployed"
            classes={{
              label: classes.hideDeletedLabel,
            }}
          />
        </div >
          {addButton}
        </div>
      )
      :
      (
        <div className={ classes.headerActions }>
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
          title: getDeploymentIconTitle(deployment.status),
          icon: getDeploymentIcon(deployment.status, settings),
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
        disabled: deployment.status === 'undeployed',
        handler: (item) => onViewStatus(item.cluster, item.id),
      })

      const buttonDeploymentType = deployment.deploymentData.deployment_type
      const buttonDeploymentVersion = deployment.deploymentData.deployment_version
      const features = getFeaturesForDeployment(deploymentForms, buttonDeploymentType, buttonDeploymentVersion)
      const enabled= features.length>0 ? false : true
      buttons.push({
        title: 'Settings',
        icon: SettingsIcon,
        disabled: enabled,
        handler: (item) => {
          const pageKey=getFirstTagForDeployment(deploymentForms, item.deployment_type, item.deploymentData.deployment_version)
          return onViewSettings(item.cluster, item.id, item.deployment_type, item.deploymentData.deployment_version, pageKey)
        },
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
          resource={deleteConfirmItem}
          open={deleteConfirmOpen}
          title={deleteConfirmItem ? `the ${deleteConfirmItem.name} deployment ${deleteConfirmItem.status == 'undeployed' ? ' permanently' : ''}` : null}t
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
