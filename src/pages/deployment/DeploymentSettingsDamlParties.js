import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'

import SimpleTable from 'components/table/SimpleTable'

import settings from 'settings'

const AddIcon = settings.icons.add
const RefreshIcon = settings.icons.refresh
const UpArrowIcon = settings.icons.upArrow
const DownArrowIcon = settings.icons.downArrow

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
  smallButton: {
    fontSize: ['9px', '!important'],
  },
  smallText: {
    fontSize: '0.7em',
  },
  alignRight: {
    textAlign: 'right',
  },
  iconSmall: {
    marginLeft: theme.spacing.unit,
    fontSize: 20,
  },
  buttonMargin: {
    marginRight: theme.spacing.unit,
  },
})

class DeploymentSettingsDamlParties extends React.Component {

  state = {
    visibleParticipant: null,
  }

  setVisibleParticipant(publicKey) {
    const newValue = this.state.visibleParticipant == publicKey ?
      null :
      publicKey
    this.setState({
      visibleParticipant: newValue,
    })
  }

  getLocalParticipantActions(entry) {
    const {
      classes,
      cluster,
      id,
      registerParticipant,
      rotateParticipantKey,
    } = this.props

    const publicKey = entry.keyManager.publicKey
    const partiesVisible = publicKey == this.state.visibleParticipant

    const actionButton = entry.participant ? (
      <Button 
        className={ classes.smallButton }
        size="small"
        variant="outlined"
        onClick={ () => rotateParticipantKey({
          cluster,
          id,
          publicKey,
        }) }
      >
        Rotate Keys <RefreshIcon className={ classes.iconSmall } />
      </Button>
    ) : (
      <Button 
        className={ classes.smallButton }
        size="small"
        variant="outlined"
        onClick={ () => registerParticipant({
          cluster,
          id,
          publicKey,
        }) }
      >
        Register <AddIcon className={ classes.iconSmall } />
      </Button>
    )

    const toggleButton = entry.participant ? (
      <Button 
        className={ classes.smallButton + ' ' + classes.buttonMargin }
        size="small"
        variant="outlined"
        onClick={ () => registerParticipant({
          cluster,
          id,
          publicKey: entry.keyManager.publicKey,
        }) }
      >
        {
          partiesVisible ? 'Hide Parties' : 'Show Parties'
        }
        {
          partiesVisible ? (
            <UpArrowIcon className={ classes.iconSmall } />
          ) : (
            <DownArrowIcon className={ classes.iconSmall } />
          )
        } 
      </Button>
    ) : null

    return (
      <div>
        { toggleButton }
        { actionButton }
      </div>
    )
  }

  getLocalParticipants() {
    const {
      classes,
      damlParticipants,
      keyManagerKeys,
    } = this.props

    const participantMap = damlParticipants.reduce((all, entry) => {
      all[entry.publicKey] = entry
      return all
    }, {})

    const localParticipants = keyManagerKeys
      .filter(entry => entry.name.indexOf('daml:') == 0)
      .map(entry => {
        return {
          keyManager: entry,
          participant: participantMap[entry.publicKey]
        }
      })

    return (
      <React.Fragment>
        {
          localParticipants.map((entry, i) => {
            return (
              <div key={ i }>
                <Grid container spacing={24}>
                  <Grid item xs={ 6 }>
                    <Typography variant="subtitle2">
                      { entry.keyManager.publicKey }
                    </Typography>
                    <Typography className={ classes.smallText }>
                      DAML ID: { entry.participant ? entry.participant.damlId : 'unregistered' }
                    </Typography>
                  </Grid>
                  <Grid item xs={ 6 } className={ classes.alignRight }>
                    { this.getLocalParticipantActions(entry) }
                  </Grid>
                </Grid>
                <div className={ classes.spacing }></div>
                <Divider />
                <div className={ classes.spacing }></div>
              </div>
            )
          })
        }
      </React.Fragment>
    )
  }

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
              <div className={ classes.spacing }></div>
              {
                this.getLocalParticipants()
              }
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