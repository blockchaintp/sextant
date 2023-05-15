import React, { useState } from 'react'
import { Button } from '@mui/material'
import { ButtonProps } from '@mui/material/Button'
import SimpleTable from '../../components/table/SimpleTable'
import SimpleTableDeleteDialog from '../../components/table/SimpleTableDeleteDialog'
import SimpleTableHeader from '../../components/table/SimpleTableHeader'
import SimpleTableActions from '../../components/table/SimpleTableActions'

import settings from '../../settings'

const AddIcon = settings.icons.add
const EditIcon = settings.icons.edit
const DeleteIcon = settings.icons.delete

interface User {
  id: string
  username: string
  permission: string
  created_at: string
}

interface UserTableProps {
  users: User[]
  onAdd: () => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  isSuperuser: boolean
}

export interface CIButtonProps extends ButtonProps {
  _ci?: string
}

const CIButton = ({ _ci, ...rest }: CIButtonProps) => {
  return <Button {...rest} />;
}

const UserTable: React.FC<UserTableProps> = ({ users, onAdd, onEdit, onDelete, isSuperuser }) => {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<User | null>(null)

  const openDeleteDialog = (item: User) => {
    setDeleteConfirmOpen(true)
    setDeleteConfirmItem(item)
  }

  const closeDeleteDialog = () => {
    setDeleteConfirmOpen(false)
  }

  const addButton = () => (
    <CIButton
      _ci="addbutton"
      id="addButton"
      variant="contained"
      color="primary"
      onClick={onAdd}
    >
      Add
      <AddIcon />
    </CIButton>
  )

  const getActions = (item: User) => {
    const actions = [{
      title: 'Delete',
      icon: DeleteIcon,
      disabled: !isSuperuser,
      handler: () => openDeleteDialog(item),
    }, {
      title: 'Edit',
      icon: EditIcon,
      handler: () => onEdit(item.id),
    }]

    return <SimpleTableActions item={item} actions={actions} />
  }

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

  return (
    <div id="tableHeader_Users">
      <SimpleTableHeader
        title="Users"
        getActions={addButton}
      />
      <SimpleTable
        pagination
        data={data}
        fields={fields}
        getActions={getActions}
      />
      <SimpleTableDeleteDialog
        resource={deleteConfirmItem || null}
        title={deleteConfirmItem ? `the ${deleteConfirmItem.username} user` : null}
        open={deleteConfirmOpen}
        onCancel={closeDeleteDialog}
        onConfirm={() => {
          closeDeleteDialog()
          onDelete(deleteConfirmItem?.id || '')
        }}
      />
    </div>
  )
}

export default UserTable
