import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import SimpleTable from 'components/table/SimpleTable'

import settings from 'settings'

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 2,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    margin: theme.spacing.unit * 2,
  },
  denseTable: {
    '& th,td': {
      padding: ['3px', '!important'],
    },
    '& tr': {
      height: ['30px', '!important'],
    }
  },
  spacing: {
    marginTop: theme.spacing.unit * 2,
  },
})

class DeploymentSettingsDamlParties extends React.Component {

  getPartiesByParticipant() {
    const {
      classes,
      damlParticipants,
      keyManagerKeys,
    } = this.props

    const localKeyMap = keyManagerKeys.reduce((all, entry) => {
      all[entry.publicKey] = true
      return all
    }, {})

    const fields =[{
      title: 'Name',
      name: 'name',
    }]

    return (
      <React.Fragment>
        {
          damlParticipants.map((participant, i) => {
            const parties = participant.parties || []
            const data = parties.map((party, j) => {
              return {
                id: j,
                name: party.name,
              }
            })
            return (
              <div key={ i } className={ classes.denseTable }>
                <div className={ classes.spacing }></div>
                <Typography variant="subtitle2">
                  { participant.publicKey } - { localKeyMap[participant.publicKey] ? 'local' : 'remote' }
                </Typography>
                <SimpleTable
                  hideHeader
                  data={ data }
                  fields={ fields }
                />
              </div>
            )
          })
        }
      </React.Fragment>
    )
  }

  render() {
    const {
      classes,
    } = this.props

    return (
      <div className={ classes.root }>
        <Grid container spacing={24}>
          <Grid item xs={ 6 }>
            <Paper className={ classes.paper }>
              <Typography variant="subtitle1">
                <strong>Local Participants</strong>
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={ 6 }>
              <Paper className={ classes.paper }>
                <Typography variant="subtitle1">
                  <strong>All Parties By Participant</strong>
                </Typography>
                {
                  this.getPartiesByParticipant()
                }
              </Paper>
            </Grid>
        </Grid>
      </div>
    )
  }
}

DeploymentSettingsDamlParties.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(DeploymentSettingsDamlParties)