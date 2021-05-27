/* eslint-disable no-shadow */
import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

import SimpleTable from 'components/table/SimpleTable'
import SimpleTableDeleteDialog from 'components/table/SimpleTableDeleteDialog'
import SimpleTableHeader from 'components/table/SimpleTableHeader'
import SimpleTableActions from 'components/table/SimpleTableActions'

import settings from 'settings'
import RoleForm from './RoleForm'
import EditRoleDialog from './EditRoleDialog'

const AddIcon = settings.icons.add
const EditIcon = settings.icons.edit
const DeleteIcon = settings.icons.delete

const styles = (theme) => ({
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
    deleteConfirmOpen: false,
    deleteConfirmItem: null,
    editConfirmOpen: false,
    editConfirmItem: null,
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

  openEditDialog(item) {
    this.setState({
      editConfirmOpen: true,
      editConfirmItem: item,
    })
  }

  closeEditDialog() {
    this.setState({
      editConfirmOpen: false,
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
      onEdit,
      onCancel,

      open,
      search,
      level,
      users,
      setOpen,
      setLevel,
      setSearch,
      loadUsers,
      clearUsers,

    } = this.props

    const {
      deleteConfirmOpen,
      deleteConfirmItem,
      editConfirmOpen,
      editConfirmItem,
    } = this.state

    const fields = [{
      title: 'User',
      name: 'user',
    }, {
      title: 'Role',
      name: 'role',
    }]

    const data = roles.map((role) => ({
      id: role.id,
      user: role.userRecord.username,
      userid: role.userRecord.id,
      role: role.permission,
    }))

    const headerActions = (
      <div className={classes.headerActions}>
        <div className={classes.addButton}>
          <Button
            onClick={() => setOpen(true)}
            variant="contained"
            color="secondary"
          >
            Add
            <AddIcon />
          </Button>
        </div>
      </div>
    )

    // eslint-disable-next-line no-unused-vars
    const getActions = (item) => (
      [
        {
          title: 'Delete',
          icon: DeleteIcon,
          handler: (currentItem) => this.openDeleteDialog(currentItem),
        },
        {
          title: 'Edit',
          icon: EditIcon,
          handler: (currentItem) => this.openEditDialog(currentItem),
        },
      ]
    )

    return (
      <div>
        <SimpleTableHeader
          title={title || 'Roles'}
          getActions={() => headerActions}
          className={headerClassname}
        />
        <SimpleTable
          data={data}
          fields={fields}
          getActions={(item) => (
            <SimpleTableActions
              item={item}
              actions={getActions(item)}
            />
          )}
        />
        <RoleForm
          title={title || 'Role'}
          open={open}
          level={level}
          search={search}
          users={users}
          setSearch={setSearch}
          setLevel={setLevel}
          loadUsers={loadUsers}
          clearUsers={clearUsers}
          onCancel={onCancel}
          onConfirm={onAdd}
        />
        <SimpleTableDeleteDialog
          resource={deleteConfirmItem || null}
          open={deleteConfirmOpen}
          title={deleteConfirmItem ? `the role for ${deleteConfirmItem.user}` : null}
          onCancel={() => this.closeDeleteDialog()}
          onConfirm={() => {
            this.closeDeleteDialog()
            onDelete(deleteConfirmItem.userid)
          }}
        />
        <EditRoleDialog
          level={editConfirmItem ? editConfirmItem.role : level}
          setLevel={setLevel}
          open={editConfirmOpen}
          onCancel={() => { onCancel(); this.closeEditDialog() }}
          onConfirm={() => {
            setSearch(editConfirmItem.user)
            this.closeEditDialog()
            onEdit(editConfirmItem.userid)
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
