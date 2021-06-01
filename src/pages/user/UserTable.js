import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import SimpleTable from 'components/table/SimpleTable'
import SimpleTableDeleteDialog from 'components/table/SimpleTableDeleteDialog'
import SimpleTableHeader from 'components/table/SimpleTableHeader'
import SimpleTableActions from 'components/table/SimpleTableActions'

import settings from 'settings'

const AddIcon = settings.icons.add
const EditIcon = settings.icons.edit
const DeleteIcon = settings.icons.delete

const styles = () => ({

})

class UserTable extends React.Component {
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
      users,
      onAdd,
      onEdit,
      onDelete,
      isSuperuser,
    } = this.props

    const {
      deleteConfirmOpen,
      deleteConfirmItem,
    } = this.state

    const fields = [{
      title: 'Username',
      name: 'username',
    }, {
      title: 'Permission',
      name: 'permission',
    }, {
      title: 'Created',
      name: 'created',
    }]

    const data = users.map((user) => ({
      id: user.id,
      username: user.username,
      permission: user.permission,
      created: new Date(user.created_at).toLocaleString(),
    }))

    const addButton = (
      <Button
        _ci="addbutton"
        className={classes.button}
        variant="contained"
        color="secondary"
        onClick={onAdd}
      >
        Add
        <AddIcon />
      </Button>
    )

    const actions = [{
      title: 'Delete',
      icon: DeleteIcon,
      disabled: !isSuperuser,
      handler: (item) => this.openDeleteDialog(item),
    }, {
      title: 'Edit',
      icon: EditIcon,
      handler: (item) => onEdit(item.id),
    }]

    return (
      <div>
        <SimpleTableHeader
          title="Users"
          getActions={() => addButton}
        />
        <SimpleTable
          pagination
          data={data}
          fields={fields}
          getActions={(item) => (
            <SimpleTableActions
              item={item}
              actions={actions}
            />
          )}
        />
        <SimpleTableDeleteDialog
          resource={deleteConfirmItem || null}
          title={deleteConfirmItem ? `the ${deleteConfirmItem.username} user` : null}
          open={deleteConfirmOpen}
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

UserTable.propTypes = {
  classes: PropTypes.object.isRequired,
  users: PropTypes.array.isRequired,
  onAdd: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default withStyles(styles)(UserTable)
