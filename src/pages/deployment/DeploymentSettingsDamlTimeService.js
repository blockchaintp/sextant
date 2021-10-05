import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles';
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'

import SimpleTable from 'components/table/SimpleTable'
import SimpleTableHeader from 'components/table/SimpleTableHeader'

const styles = (theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    margin: theme.spacing(2),
  },
})

class DeploymentSettingsDamlTimeService extends React.Component {
  getTimeServiceInfo() {
    const {
      timeServiceInfo,
    } = this.props

    const fields = [{
      title: 'Public Key of Keeper',
      name: 'publicKey',
    }, {
      title: 'Last Clock Update',
      name: 'lastClockUpdate',
    }]

    const data = timeServiceInfo.map((entry) => ({ ...entry, id: entry.publicKey }))

    return (
      <div>
        <SimpleTableHeader
          title="Time Service"
        />
        <SimpleTable
          data={data}
          fields={fields}
        />
      </div>
    )
  }

  render() {
    const {
      classes,
    } = this.props

    return (
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              { this.getTimeServiceInfo() }
            </Paper>
          </Grid>
        </Grid>
      </div>
    )
  }
}

DeploymentSettingsDamlTimeService.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(DeploymentSettingsDamlTimeService)
