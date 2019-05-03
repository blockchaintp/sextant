import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import SimpleTable from 'components/table/SimpleTable'
import SimpleTableDeleteDialog from 'components/table/SimpleTableDeleteDialog'
import SimpleTableHeader from 'components/table/SimpleTableHeader'
import SimpleTableActions from 'components/table/SimpleTableActions'

import MenuButton from 'components/layout/MenuButton'

import settings from 'settings'

const AddIcon = settings.icons.add
const EditIcon = settings.icons.edit
const DeleteIcon = settings.icons.delete

const styles = theme => ({
  errorText: {
    color: theme.palette.error.main,
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
      onAdd,
      onEdit,
      onDelete,
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
      title: 'Status',
      name: 'status',
    },{
      title: 'Task',
      name: 'task',
    }]

    const data = clusters.map((cluster, index) => {
      return {
        id: cluster.id,
        name: cluster.name,
        provision_type: cluster.provision_type,
        status: cluster.status,
        task: (
          <div>
            <div>
              { cluster.task.action } ({ cluster.task.status })
            </div>
            {
              cluster.task.error && (
                <div className={ classes.errorText }>
                  { cluster.task.error }
                </div>
              )
            }
          </div>
        ),
      }
    })

    const addButtonItems = [{
      title: 'Remote Cluster',
      handler: () => onAdd('remote')
    }, {
      title: 'Local Cluster',
      handler: () => onAdd('local')
    }]

    const addButton = (
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
    )

    const actions = [{
      title: 'Delete',
      icon: DeleteIcon,
      handler: (item) => this.openDeleteDialog(item),
    }, {
      title: 'Edit',
      icon: EditIcon,
      handler: (item) => onEdit(item.id),
    }]

    return (
      <div>
        <SimpleTableHeader
          title='Clusters'
          getActions={ () => addButton }
        />
        <SimpleTable
          data={ data }
          fields={ fields }
          getActions={ (item) => (
            <SimpleTableActions
              item={ item }
              actions={ actions }
            />
          )}
        />
        <SimpleTableDeleteDialog
          open={ deleteConfirmOpen }
          title={ deleteConfirmItem ? `the ${deleteConfirmItem.name} cluster` : null }
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

