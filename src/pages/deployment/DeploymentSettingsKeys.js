import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'

import SimpleTable from 'components/table/SimpleTable'
import SimpleTableDeleteDialog from 'components/table/SimpleTableDeleteDialog'
import SimpleTableHeader from 'components/table/SimpleTableHeader'
import SimpleTableActions from 'components/table/SimpleTableActions'

import settings from 'settings'

const AddIcon = settings.icons.add

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 2,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    margin: theme.spacing.unit * 2,
  },
})

class DeploymentSettingsKeys extends React.Component {

  getLocalKeys() {

    const {
      classes,
      localKeys,
    } = this.props

    const data = localKeys.map(key => {
      return {
        id: key.id,
        key: key.key,
        type: key.type,
      }
    })

    const fields =[{
      title: 'Key',
      name: 'key',
    }, {
      title: 'Type',
      name: 'type',
    }]

    return (
      <div>
        <SimpleTableHeader
          title='Local Keys'
        />
        <SimpleTable
          data={ data }
          fields={ fields }
        />
      </div>
    )
  }

  getRemoteKeys() {

    const {
      classes,
      remoteKeys,
    } = this.props

    const data = remoteKeys.map(key => {
      return {
        id: key.id,
        key: key.key,
      }
    })

    const fields =[{
      title: 'Key',
      name: 'key',
    }]

    const addButton = (
      <Button
        variant='contained'
        color='secondary'
        onClick={ () => console.log('add') }
      >
        Add
        <AddIcon />
      </Button>
    )

    return (
      <div>
        <SimpleTableHeader
          title='Remote Keys'
          getActions={ () => addButton }
        />
        <SimpleTable
          data={ data }
          fields={ fields }
        />
      </div>
    )
  }
  render() {
    const {
      classes,
      cluster,
      id,
      deployment,
      localKeys,
      remoteKeys,
    } = this.props

    return (
      <div className={ classes.root }>
        <Grid container spacing={24}>
          <Grid item xs={ 6 }>
            <Paper className={ classes.paper }>
              { this.getLocalKeys() }
            </Paper>
          </Grid>
          <Grid item xs={ 6 }>
            <Paper className={ classes.paper }>
              { this.getRemoteKeys() }
            </Paper>
          </Grid>
        </Grid>
      </div>
    )
  }
}

DeploymentSettingsKeys.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(DeploymentSettingsKeys)