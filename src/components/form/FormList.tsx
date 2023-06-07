import * as React from 'react'
import { styled } from '@mui/system'
import {
    Button,
    Typography,
} from '@mui/material'

import SimpleTable from '../table/SimpleTable'
import SimpleTableDeleteDialog from '../table/SimpleTableDeleteDialog'
import SimpleTableHeader from '../table/SimpleTableHeader'
import SimpleTableActions from '../table/SimpleTableActions'

import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import KeyIcon from '@mui/icons-material/Key'

import Sortable from '../dragdrop/Sortable'
import Draggable from '../dragdrop/Draggable'

import FormListDialog from './FormListDialog'

type RenderFunctionProps = {
  isDragging: boolean;
}

type Table = {
  name: string
  title: string
  sortable?: boolean
  render?: (item: unknown) => React.ReactNode
  id?: number
  index?: string
  _item?: unknown
  [key: string]: any; // Add an index signature to allow any string key
}

type Item = {
  component: string
  id: string
  title: string
  list: {
    mainField: string
    schema: unknown[]
    id: string
    table: Table[]
  }
  validate: unknown[]
  helperText?: string
  skip?: boolean
}

interface FormListProps {
    arrayHelpers: {
        remove: (id: number) => void
        replace: (id: number, values: unknown) => void
        push: (values: unknown) => void
        swap: (fromIndex: number, toIndex: number) => void
    }
    disabled: boolean
    formProps: {
      touched: boolean | {}
      values: {
        [key: string]: {
          [key: string]: string | number
        }[]
      }
      errors: {
        [key: string]: string
      }
      hooks: {
        disabled: boolean
        validate: boolean
        hidden: {
          [key: string]: string | boolean
        }
      }
    }
    item: Item
}

const AddButtonContainer = styled('div')(({ theme }) => ({
    marginTop: theme.spacing(2),
}))

  const StyledButton = styled(Button)(({ theme }) => ({
    marginRight: theme.spacing(2),
}))

const ListTableTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  flex: 'flexGrow',
}))

const ListTable = styled('div')(({ theme }) => ({
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }))

const FormListInner: React.FC<FormListProps> = ({
    arrayHelpers,
    disabled,
    formProps,
    item,
}) => {
    const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false)
    const [deleteConfirmItem, setDeleteConfirmItem] = React.useState(null)
    const [editOpen, setEditOpen] = React.useState(false)
    const [editItem, setEditItem] = React.useState(null)

    const onAdd = () => {
        setEditOpen(true)
        setEditItem(null)
    }

    const onEdit = (item: FormListProps["item"]) => {
        setEditOpen(true)
        setEditItem(item)
    }

    const onCancel = () => {
        setEditOpen(false)
        setEditItem(null)
    }

    const onDeleteId = (id: number) => {
      arrayHelpers.remove(id)
    }

    const onSave = (values: FormListProps[]) => {
        if (editItem) {
            arrayHelpers.replace(editItem.id, values)
        } else {
            arrayHelpers.push(values)
        }
        setEditOpen(false)
        setEditItem(null)
    }

    const onSwap = (fromIndex: number, toIndex: number) => {
      arrayHelpers.swap(fromIndex, toIndex)
    }

    const openDeleteDialog = (item: FormListProps["item"]) => {
        setDeleteConfirmOpen(true)
        setDeleteConfirmItem(item)
    }

    const closeDeleteDialog = () => {
        setDeleteConfirmOpen(false)
    }

      const value: FormListProps["formProps"]["values"] | [] = formProps.values || []

      const fields = item.list.table
      const { mainField } = item.list

      const data = (value as any[]).map((currentItem, index) => {
        const ret: Table & { id?: number, index?: string, _item?: any } = fields.reduce((all, field) => {
          const baseRenderValue = field.render
            ? field.render(currentItem)
            : currentItem[field.name]
          let renderValue = baseRenderValue

          if (field.sortable && !disabled) {
            renderValue = (
              <Sortable
                id={index}
                index={index}
                reorderDrag={onSwap}
                render={({ isDragging }: RenderFunctionProps) => (
                  <div>
                    <Draggable
                      isDragging={isDragging}
                    >
                      { baseRenderValue }
                    </Draggable>
                  </div>
                )}
              />
            )
          }

          all[field.name] = renderValue

          return all
        }, {} as Table & { id: number, index: string, _item: any })

        ret.id = index
        ret.index = index.toString()
        ret._item = {
          ...currentItem,
          id: index,
          index,
        }
        return ret
      })

      const addButton = (
        <AddButtonContainer>
          <StyledButton
            variant="contained"
            onClick={onAdd}
            size="small"
          >
            Add
            <AddIcon />
          </StyledButton>
        </AddButtonContainer>
      )

      const changePasswordButton = (
        <div>
          <StyledButton
            variant="text"
            onClick={onAdd}
            size="medium"
            endIcon={<KeyIcon />}
          >
            Change Password
          </StyledButton>
        </div>
      )

      const actions = [{
        title: 'Delete',
        icon: DeleteIcon,
        handler: (currentData: Table & { id?: number, index?: string, _item?: any }) => openDeleteDialog(currentData._item),
      }, {
        title: 'Edit',
        icon: EditIcon,
        handler: (currentData: Table & { id?: number, index?: string, _item?: any }) => onEdit(currentData._item),
      }]

      const {
        title, skip, helperText, list,
      } = item

      if (item.id === 'changePassword') {
        return (
          <>
            <FormListDialog
              title={title}
              schema={list.schema}
              open={editOpen}
              initialValues={editItem || {}}
              onCancel={onCancel}
              onSave={onSave}
            />
            { changePasswordButton }
          </>
        )
      }

    return (
      <ListTable>
        <SimpleTableHeader
          sx={{ paddingLeft: '0px', display: 'flex' }}
          // eslint-disable-next-line react/no-unstable-nested-components
          getTitle={() => (
            <>
              <ListTableTitle noWrap variant="subtitle1">{ skip ? null : title }</ListTableTitle>
              <ListTableTitle variant="caption">{ helperText }</ListTableTitle>
            </>
          )}
        />
        <SimpleTable
          data={data}
          fields={fields}
          // eslint-disable-next-line react/no-unstable-nested-components
          getActions={(currentItem: Item) => {
            if (disabled) return null
            return (
              <SimpleTableActions
                item={currentItem}
                actions={actions}
              />
            )
          }}
          hideHeaderIfEmpty
        />

        { disabled ? null : addButton }

        <SimpleTableDeleteDialog
          resourceType=""
          open={deleteConfirmOpen}
          title={deleteConfirmItem ? deleteConfirmItem[mainField] : null}
          onCancel={() => closeDeleteDialog()}
          onConfirm={() => {
            onDeleteId(deleteConfirmItem.id)
            closeDeleteDialog()
          }}
        />

        <FormListDialog
          title={item.title || item.id}
          schema={item.list.schema}
          open={editOpen}
          initialValues={editItem || {}}
          onCancel={onCancel}
          onSave={onSave}
        />
      </ListTable>
    )
  }

  const FormList = FormListInner

  export default FormList
