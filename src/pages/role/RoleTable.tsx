/* eslint-disable no-shadow */
import * as React from 'react'
import { styled } from '@mui/system'
import Button from '@mui/material/Button'

import SimpleTable from '../../components/table/SimpleTable'
import SimpleTableDeleteDialog from '../../components/table/SimpleTableDeleteDialog'
import SimpleTableHeader from '../../components/table/SimpleTableHeader'
import SimpleTableActions from '../../components/table/SimpleTableActions'

import settings from '../../settings'
import RoleForm, { User } from './RoleForm'
import EditRoleDialog from './EditRoleDialog'

type ActionData = {
  id: number
  userid: number
  username: string
  role: string
}

type Role = {
  id: number
  permission: string
  resource_id: number
  resource_type: string
  user: number
  userRecord: {
    id: number
    permission: string
    username: string
  }
}

export type RoleTableProps = {
  title: string
  roles: Role[]
  onAdd: () => void
  onDelete: (id: number) => void
  onEdit: (value: string) => void
  onCancel: () => void
  open: boolean
  search: string | ""
  level: string
  users: User[]
  userList: User[]
  setOpen: (value: boolean) => void
  setSearch: (search: string) => void
  setLevel: (level: string) => void
  loadUsers: (search: string) => void
  clearUsers: () => void
}

const AddIcon = settings.icons.add
const EditIcon = settings.icons.edit
const DeleteIcon = settings.icons.delete

const HeaderActionsWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'right',
  alignItems: 'center',
})

const RoleTable: React.FC<RoleTableProps> = ({
  title,
  roles,
  onAdd,
  onDelete,
  onEdit,
  onCancel,
  open,
  search,
  level,
  userList,
  setOpen,
  setSearch,
  setLevel,
  loadUsers,
  clearUsers,
}) => {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false)
  const [deleteConfirmItem, setDeleteConfirmItem] = React.useState<ActionData | null>(null)
  const [editConfirmOpen, setEditConfirmOpen] = React.useState(false)
  const [editConfirmItem, setEditConfirmItem] = React.useState<ActionData | null>(null)

  const openDeleteDialog = (item: ActionData) => {
    setDeleteConfirmOpen(true)
    setDeleteConfirmItem(item)
  }

  const closeDeleteDialog = () => {
    setDeleteConfirmOpen(false)
  }

  const openEditDialog = (item: ActionData) => {
    setEditConfirmOpen(true)
    setEditConfirmItem(item)
  }

  const closeEditDialog = () => {
    setEditConfirmOpen(false)
  }

  const fields = [{
    title: 'User',
    name: 'username',
  }, {
    title: 'Role',
    name: 'role',
  }]

  const data: ActionData[] = roles.map((role) => ({
    id: role.id,
    userid: role.userRecord.id,
    username: role.userRecord.username,
    role: role.permission,
  }))

  const headerActions = (
    <HeaderActionsWrapper>
      <Button
        onClick={() => setOpen(true)}
        variant="contained"
        color="primary"
      >
        Add
        <AddIcon />
      </Button>
    </HeaderActionsWrapper>
  )

  const getActions = () => ([
      {
        title: 'Delete',
        icon: DeleteIcon,
        handler: (currentItem: ActionData) => openDeleteDialog(currentItem),
      },
      {
        title: 'Edit',
        icon: EditIcon,
        handler: (currentItem: ActionData) => openEditDialog(currentItem),
      },
    ])

  return (
    <div>
      <SimpleTableHeader
        title={title || 'Roles'}
        getActions={() => headerActions}
      />
      <SimpleTable
        data={data}
        fields={fields}
        getActions={(item: ActionData) => {
          return(
            <SimpleTableActions
              item={item}
              actions={getActions()}
            />
          )
        }}
      />
      <RoleForm
        title={title || 'Role'}
        open={open}
        level={level}
        search={search}
        userList={userList}
        setSearch={setSearch}
        setLevel={setLevel}
        loadUsers={loadUsers}
        clearUsers={clearUsers}
        onCancel={onCancel}
        onConfirm={onAdd}
      />
      {deleteConfirmItem &&
        <SimpleTableDeleteDialog
          open={deleteConfirmOpen}
          title={deleteConfirmItem.username}
          onCancel={() => closeDeleteDialog()}
          onConfirm={() => {
            closeDeleteDialog()
            onDelete(deleteConfirmItem.userid)
          }}
        />
      }
      {editConfirmItem &&
        <EditRoleDialog
          level={editConfirmItem ? editConfirmItem.id.toString() : level}
          setLevel={setLevel}
          open={editConfirmOpen}
          onCancel={() => { onCancel(); closeEditDialog() }}
          onConfirm={() => {
            setSearch(editConfirmItem.username)
            closeEditDialog()
            onEdit(editConfirmItem.userid.toString())
          }}
        />
      }
    </div>
  )
}

export default RoleTable
