import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'

import SimpleTable from 'components/table/SimpleTable'
import SimpleTableHeader from 'components/table/SimpleTableHeader'

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 2,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    margin: theme.spacing.unit * 2,
  },
  tableHeading: {
    marginTop: theme.spacing.unit * 2,
  },
  denseTable: {
    '& th,td': {
      padding: ['3px', '!important'],
    }
  }
})

class DeploymentSettingsDaml extends React.Component {

  getLocalParticipantTable({
    participants,
  }) {

    const {
      classes,
    } = this.props

    const fields =[{
      title: 'Name',
      name: 'name',
    },{
      title: 'Key',
      name: 'id',
    },{
      title: 'DAML ID',
      name: 'damlId',
    },{
      title: 'Actions',
      name: 'actions',
      numeric: true,
    }]

    const data = participants.map((participant, i) => {
      const action = participant.damlId ? (
        <Button 
          size="small"
          variant="outlined"
          onClick={ () => this.setFormOpen(false) }
        >
          Rotate Keys
        </Button>
      ) : (
        <Button 
          size="small"
          variant="outlined"
          onClick={ () => this.setFormOpen(false) }
        >
          Register
        </Button>
      )
      return {
        id: participant.key.substring(0, 8),
        name: `#${i+1}`,
        damlId: participant.damlId ? participant.damlId.substring(0, 8) : 'none',
        actions: action,
      }
    })

    return (
      <div className={ classes.denseTable }>
        <SimpleTable
          data={ data }
          fields={ fields }
        />
      </div>
    )
  }

  getRemoteParticipantTable({
    participants,
  }) {

    const {
      classes,
    } = this.props

    const fields =[{
      title: 'Key',
      name: 'id',
    },{
      title: 'DAML ID',
      name: 'damlId',
    }]

    const data = participants.map((participant, i) => {
      return {
        id: participant.key.substring(0, 8),
        damlId: participant.damlId ? participant.damlId.substring(0, 8) : 'none',
      }
    })

    return (
      <div className={ classes.denseTable }>
        <SimpleTable
          data={ data }
          fields={ fields }
        />
      </div>
    )
  }


  getData() {
    const {
      localDamlRPCKeys,
      damlParticipants,
    } = this.props

    const participantsByKey = damlParticipants.reduce((all, participant) => {
      all[participant.key] = participant
      return all
    }, {})

    const localKeyMap = localDamlRPCKeys.reduce((all, key) => {
      all[key.id] = key.id
      return all
    }, {})

    const localParticipants = localDamlRPCKeys.map(key => {
      const participant = participantsByKey[key.id]
      return {
        id: key.id,
        key: key.id,
        damlId: participant ? participant.id : null,
      }
    })

    const remoteParticipants = damlParticipants.filter(participant => {
      return localKeyMap[participant.key] ? false : true
    })

    return {
      localParticipants,
      remoteParticipants,
    }
  }

  render() {
    const {
      classes,
      localDamlRPCKeys,
      damlParticipants,
    } = this.props

    const data = this.getData()

    return (
      <div className={ classes.root }>
        <Grid container spacing={24}>
          <Grid item xs={ 4 }>
            <Paper className={ classes.paper }>
              <div className={ classes.tableHeading }>
                <Typography variant="subtitle1">
                  <strong>Local Participants</strong>
                </Typography>
              </div>
              {
                this.getLocalParticipantTable({
                  participants: data.localParticipants,
                })
              }
              <div className={ classes.tableHeading }>
                <Typography variant="subtitle1">
                  <strong>Other Participants</strong>
                </Typography>
              </div>
              {
                this.getRemoteParticipantTable({
                  participants: data.remoteParticipants,
                })
              }
            </Paper>
          </Grid>
        </Grid>
      </div>
    )
  }
}

DeploymentSettingsDaml.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(DeploymentSettingsDaml)