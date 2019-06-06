import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'

import SimpleTable from 'components/table/SimpleTable'

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 2,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    margin: theme.spacing.unit * 2,
  },
  spacing: {
    marginTop: theme.spacing.unit * 2,
  },
  smallButton: {
    fontSize: ['9px', '!important'],
  },
  checkbox: {
    padding: ['3px', '!important'],
    paddingLeft: ['12px', '!important'],
  },
  denseTable: {
    '& th,td': {
      padding: ['3px', '!important'],
    },
    '& tr': {
      height: ['30px', '!important'],
    }
  },
  participantOptionsContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  participantOptionsTitle: {
    flexGrow: 1,
  },
  participantOptionsButtons: {
    flexGrow: 0,
  },
  participantOptionsButton: {
    fontSize: ['9px', '!important'],
    marginLeft: theme.spacing.unit,
  },
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
          className={ classes.smallButton }
          size="small"
          variant="outlined"
          onClick={ () => this.setFormOpen(false) }
        >
          Rotate Keys
        </Button>
      ) : (
        <Button 
          className={ classes.smallButton }
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

  getPartiesByParticipant({
    participants,
  }) {
    const {
      classes,
    } = this.props
    return (
      <React.Fragment>
        {
          participants.map((participant, i) => {

            const parties = participant.parties || []
            const data = parties.map((party, j) => {
              return {
                id: j,
                name: party.name,
              }
            })
            const fields =[{
              title: 'Name',
              name: 'name',
            }]
            return (
              <div key={ i } className={ classes.denseTable }>
                <div className={ classes.spacing }></div>
                <Typography variant="subtitle2">
                  <strong>{`#${i+1}`}</strong>
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

  getPartyOptions({
    participants,
  }) {
    const {
      classes,
      selectedParties,
      setSelectedParty,
    } = this.props

    return (
      <React.Fragment>
        {
          participants.map((participant, i) => {

            const selected = selectedParties[participant.id] || {}

            const parties = participant.parties || []
            const data = parties.map((party, j) => {
              return {
                id: j,
                name: (
                  <div>
                    <FormControlLabel
                      control={
                        <Checkbox
                          className={ classes.checkbox }
                          checked={ selected[party.name] ? true : false }
                          onChange={ (event) => {
                            setSelectedParty({
                              participant: participant.id,
                              party: party.name,
                              value: event.target.checked,
                            })
                          }}
                          value={ party.name }
                        />
                      }
                      label={ party.name }
                    />
                  </div> 
                ),
              }
            })
            const fields =[{
              title: 'Name',
              name: 'name',
            }]
            return (
              <div key={ i } className={ classes.denseTable }>
                <div className={ classes.spacing }></div>
                <div className={ classes.participantOptionsContainer }>
                  <div className={ classes.participantOptionsTitle }>
                    <Typography variant="subtitle2">
                      <strong>{`#${i+1}`}</strong>
                    </Typography>
                  </div>
                  <div className={ classes.participantOptionsButtons }>
                    <Button 
                      className={ classes.participantOptionsButton }
                      size="small"
                      variant="outlined"
                      onClick={ () => this.setFormOpen(false) }
                    >
                      Add Party
                    </Button>
                    <Button 
                      className={ classes.participantOptionsButton }
                      size="small"
                      variant="outlined"
                      onClick={ () => this.setFormOpen(false) }
                    >
                      Generate Tokens
                    </Button>
                    <Button 
                      className={ classes.participantOptionsButton }
                      size="small"
                      variant="outlined"
                      onClick={ () => this.setFormOpen(false) }
                    >
                      Remove
                    </Button>
                  </div>
                </div>
                
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

    const localParticipants = localDamlRPCKeys.map((key, i) => {
      const participant = participantsByKey[key.id]
      return {
        id: key.id,
        name: i+1,
        key: key.id,
        damlId: participant ? participant.id : null,
        parties: participant ? (participant.parties || []) : [],
      }
    })

    const remoteParticipants = damlParticipants
      .filter(participant => {
        return localKeyMap[participant.key] ? false : true
      })
      .map(participant => {
        return {
          id: participant.key,
          key: participant.key,
          damlId: participant.id,
        }
      })

    const registeredParticipants = localParticipants.filter(participant => {
      return participantsByKey[participant.id] ? true : false
    })
    
    damlParticipants.filter(participant => {
      return localKeyMap[participant.key] ? true : false
    })

    return {
      localParticipants,
      remoteParticipants,
      registeredParticipants,
    }
  }

  render() {
    const {
      classes,
    } = this.props

    const data = this.getData()

    return (
      <div className={ classes.root }>
        <Grid container spacing={8}>
          <Grid item xs={ 4 }>
            <Paper className={ classes.paper }>
              <Typography variant="subtitle1">
                <strong>Local Participants</strong>
              </Typography>
              {
                this.getLocalParticipantTable({
                  participants: data.localParticipants,
                })
              }
              <div className={ classes.spacing }></div>
              <Typography variant="subtitle1">
                <strong>Other Participants</strong>
              </Typography>
              {
                this.getRemoteParticipantTable({
                  participants: data.remoteParticipants,
                })
              }
            </Paper>
          </Grid>
          <Grid item xs={ 4 }>
            <Paper className={ classes.paper }>
              <Typography variant="subtitle1">
                <strong>Configure Parties</strong>
              </Typography>
              {
                this.getPartyOptions({
                  participants: data.registeredParticipants,
                })
              }
            </Paper>
          </Grid>
          <Grid item xs={ 4 }>
            <Paper className={ classes.paper }>
              <Typography variant="subtitle1">
                <strong>Parties By Participant</strong>
              </Typography>
              {
                this.getPartiesByParticipant({
                  participants: data.registeredParticipants,
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