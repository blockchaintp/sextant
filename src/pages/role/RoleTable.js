import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button  from '@material-ui/core/Button'

import SimpleTable from 'components/table/SimpleTable'
import SimpleTableDeleteDialog from 'components/table/SimpleTableDeleteDialog'
import SimpleTableHeader from 'components/table/SimpleTableHeader'
import SimpleTableActions from 'components/table/SimpleTableActions'

import MenuButton from 'components/layout/MenuButton'

import RoleForm from './RoleForm'

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

class RoleTable extends React.Component {

  state = {
    formOpen: false,
    deleteConfirmOpen: false,
    deleteConfirmItem: null,
  }

  openForm() {
    this.setState({
      formOpen: true,
    })
  }

  cancelForm() {
    this.setState({
      formOpen: false,
    })
  }

  confirmForm() {
    this.setState({
      formOpen: false,
    })
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
      title,
      headerClassname,
      roles,
      onAdd,
      onDelete,
    } = this.props

    const {
      deleteConfirmOpen,
      deleteConfirmItem,
    } = this.state

    const fields =[{
      title: 'User',
      name: 'user',
    }, {
      title: 'Role',
      name: 'role',
    }]

    const data = roles.map((role, index) => {
      return {
        id: roles.id,
        user: role.user,
        role: role.role,
      }
    })

    const headerActions = (
      <div className={ classes.headerActions }>
        <div className={ classes.addButton }>
          <Button 
            onClick={ () => {
              this.openForm()
            }} 
            variant="contained" 
            color="secondary" 
          >
            Add
            <AddIcon />
          </Button>
        </div>
      </div>
    )

    const getActions = (item) => {
      const baseActions = [{
        title: 'Delete',
        icon: DeleteIcon,
        handler: (item) => this.openDeleteDialog(item),
      }]
      return baseActions
    }

    return (
      <div>
        <SimpleTableHeader
          title={ title || 'Roles' }
          getActions={ () => headerActions }
          className={ headerClassname }
        />
        <SimpleTable
          data={ data }
          fields={ fields }
          getActions={ (item) => {
            return (
              <SimpleTableActions
                item={ item }
                actions={ getActions(item) }
              />
            )
          }}
        />
        <RoleForm
          title={ title || 'Role' }
          open={ this.state.formOpen }
          onCancel={ () => this.cancelForm() }
          onConfirm={ () => this.confirmForm() }
        />
        <SimpleTableDeleteDialog
          open={ deleteConfirmOpen }
          title={ deleteConfirmItem ? `the ${deleteConfirmItem.user} role` : null }
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

RoleTable.propTypes = {
  classes: PropTypes.object.isRequired,
  roles: PropTypes.array.isRequired,
  onAdd: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default withStyles(styles)(RoleTable)

