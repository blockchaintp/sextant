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

const TABLE_FIELDS =[{
  title: 'Volume',
  name: 'volume',
},{
  title: 'Name',
  name: 'name',
},{
  title: 'Date',
  name: 'date',
}]

const FORM_SCHEMA = [{
  id: 'volume',
  title: 'Volume',
  helperText: 'Choose the volume you want to take a snapshot for',
  component: 'select',
  validate: {
    type: 'string',
  },
}, {
  id: 'name',
  title: 'Name',
  helperText: 'The name of your snapshot (alphanumeric, no spaces or dashes)',
  component: 'text',
  validate: {
    type: 'string',
    methods: [
      ['required', 'Required'],
      ['matches', ['^[\\w]{1,128}$'], "must be alphanumeric name, with no spaces or dashes and maximum 128 characters"]
    ],
  },
}]

const FORM_INITIAL_VALUES = {
  volume: '',
  name: '',
}

class TaekionSnapshots extends React.Component {

  render() {
    const {
      classes,
      cluster,
      deployment,
      volumes,
      snapshots,
    } = this.props

    const data = snapshots.map((snapshot, index) => {
      return {
        id: `${snapshot.volume}-${snapshot.name}`,
        name: snapshot.name,
        volume: snapshot.volume,
        date: snapshot.date,
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
            onClick={ () => {} }
          >
            Add
          <AddIcon />
          </Button>
        </div>
      </div>
    )

    const getActions = () => {
  
      const buttons = [{
        title: 'Delete',
        icon: DeleteIcon,
        handler: () => {},
      }]

      return buttons
    }

    return (
      <div>
        <SimpleTableHeader
          title="Snapshots"
          getActions={ () => headerActions }
        />
        <SimpleTable
          pagination
          data={ data }
          fields={ TABLE_FIELDS }
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

export default withStyles(styles)(TaekionSnapshots)