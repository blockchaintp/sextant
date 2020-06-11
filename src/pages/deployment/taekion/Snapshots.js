import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import SimpleTable from 'components/table/SimpleTable'
import SimpleTableDeleteDialog from 'components/table/SimpleTableDeleteDialog'
import SimpleTableHeader from 'components/table/SimpleTableHeader'
import SimpleTableActions from 'components/table/SimpleTableActions'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

import settings from 'settings'

const AddIcon = settings.icons.add
const EditIcon = settings.icons.edit
const DeleteIcon = settings.icons.delete

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 2,
  },
  headerActions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'right',
    alignItems: 'center',
  },
  volumeSelect: {
    marginRight: theme.spacing.unit * 2,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 200,
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
      params,
      volume,
      volumes,
      snapshots,
      onChangeVolume,
    } = this.props

    const data = snapshots.map((snapshot, index) => {
      return {
        id: `${snapshot.volume}-${snapshot.name}`,
        name: snapshot.name,
        volume: snapshot.volume,
        date: snapshot.date,
      }
    })

    const volumeOptions = [{
      id: 'all',
      name: 'All',
    }].concat(volumes.map(volume => {
      return {
        id: volume.name,
        name: volume.name,
      }
    }))

    const headerActions = (
      <div className={ classes.headerActions }>
        <div className={ classes.volumeSelect }>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="name-readonly">Volume</InputLabel>
            <Select
              value={ volume }
              onChange={ (ev) => onChangeVolume(ev.target.value, params) }
            >
              {
                volumeOptions
                  .map((volume, i) => {
                    return (
                      <MenuItem
                        key={ i }
                        value={ volume.id }
                      >
                        { volume.name }
                      </MenuItem>
                    )
                  })
              }
            </Select>
          </FormControl>
        </div>
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