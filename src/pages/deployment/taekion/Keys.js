import React from 'react'
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

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 2,
  },
})

const FIELDS =[{
  title: 'Name',
  name: 'name',
},{
  title: 'Fingerprint',
  name: 'fingerprint',
}]

class TaekionKeys extends React.Component {

  render() {
    const {
      classes,
      keys,
    } = this.props

    const data = keys.map((key, index) => {
      return {
        id: key.id,
        name: key.name,
        fingerprint: key.fingerprint,
      }
    })

    const headerActions = (
      <div className={ classes.headerActions }>
        <div className={ classes.addButton }>
          <Button
            _ci='addbutton'
            className={ classes.button }
            variant= 'contained'
            color= 'secondary'
            onClick={() => {}}
          >
            Add
          <AddIcon />
          </Button>
        </div>
      </div>
    )

    const getActions = () => {
  
      const buttons = [{
        title: 'Edit',
        icon: EditIcon,
        handler: (item) => onEdit(item.id),
      }, {
        title: 'Delete',
        icon: DeleteIcon,
        handler: (item) => onDelete(item.id),
      }]

      return buttons
    }

    return (
      <div>
        <SimpleTableHeader
          title="Keys"
          getActions={ () => headerActions }
        />
        <SimpleTable
          pagination
          data={ data }
          fields={ FIELDS }
          getActions={ (item) => {
            return (
              <SimpleTableActions
                item={ item }
                actions={ getActions(item) }
              />
            )
          }}
        />
      </div>
    )
  }
}

export default withStyles(styles)(TaekionKeys)