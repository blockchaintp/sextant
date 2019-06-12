import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'

import SimpleTable from 'components/table/SimpleTable'

import settings from 'settings'

const AddIcon = settings.icons.add
const DeleteIcon = settings.icons.delete
const RefreshIcon = settings.icons.refresh
const UpArrowIcon = settings.icons.upArrow
const DownArrowIcon = settings.icons.downArrow
const KeyIcon = settings.icons.key

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
  partyButtons: {
    marginTop: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 2,
  },
  buttonMargin: {
    marginRight: theme.spacing.unit,
  },
  buttonBottomMargin: {
    marginBottom: theme.spacing.unit,
  },
  partyContainer: {
    marginTop: theme.spacing.unit * 2, 
    padding: theme.spacing.unit * 2,
    border: '1px dashed #e5e5e5'
  }
})

class DeploymentSettingsDamlParties extends React.Component {

  componentDidMount() {
    const {
      setVisibleParticipant,
    } = this.props
    setVisibleParticipant(null)
  }

  setVisibleParticipant(publicKey) {
    const {
      resetSelectedParties,
      visibleParticipant,
      setVisibleParticipant,
    } = this.props
    const newValue = visibleParticipant == publicKey ?
      null :
      publicKey
    setVisibleParticipant(newValue)
    resetSelectedParties()
  }

  getLocalParticipantActions(entry) {
    const {
      classes,
      cluster,
      id,
      registerParticipant,
      rotateParticipantKey,
      visibleParticipant,
    } = this.props

    const publicKey = entry.keyManager.publicKey
    const partiesVisible = publicKey == visibleParticipant

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
        onClick={ () => this.setVisibleParticipant(publicKey) }
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

  getLocalParties(entry) {
    const {
      classes,
      selectedParties,
      setSelectedParties,
      setSelectedParty,
    } = this.props

    const {
      participant: {
        parties = [],
      },
    } = entry

    const fields =[{
      title: 'Name',
      name: 'name',
    }]

    const data = parties.map((party, j) => {
      return {
        id: j,
        name: (
          <div>
            <FormControlLabel
              control={
                <Checkbox
                  className={ classes.checkbox }
                  checked={ selectedParties[party.name] ? true : false }
                  onChange={ (event) => {
                    setSelectedParty({
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

    let checkedCount = 0

    parties.forEach(party => {
      if(selectedParties[party.name]) checkedCount++
    })

    return (
      <Grid container spacing={0}>
        <Grid item xs={ 6 }>
          <div className={ classes.partyContainer }>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    className={ classes.checkbox }
                    checked={ checkedCount >= parties.length }
                    onChange={ (event) => {
                      const isChecked = event.target.checked
                      if(!isChecked) {
                        setSelectedParties({})
                      }
                      else {
                        const allChecked = parties.reduce((all, party) => {
                          all[party.name] = true
                          return all
                        }, {})
                        setSelectedParties(allChecked)
                      }
                    }}
                    value="all"
                  />
                }
                label="All"
              />
            </div>
            {
              parties.map((party, j) => {
                return (
                  <div key={ j }>
                    <FormControlLabel
                      control={
                        <Checkbox
                          className={ classes.checkbox }
                          checked={ selectedParties[party.name] ? true : false }
                          onChange={ (event) => {
                            setSelectedParty({
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
                )
              })
            }
          </div>
        </Grid>
        <Grid item xs={ 6 }>
          <div className={ classes.partyButtons }>
            <Button 
              className={ classes.smallButton + ' ' + classes.buttonBottomMargin }
              size="small"
              variant="outlined"
              onClick={ () => this.setFormOpen(true, participant.id) }
            >
              Add Party <AddIcon className={ classes.iconSmall } />
            </Button>
            <br />
            <Button 
              className={ classes.smallButton + ' ' + classes.buttonBottomMargin }
              size="small"
              variant="outlined"
              onClick={ () => {} }
            >
              Generate Tokens <KeyIcon className={ classes.iconSmall } />
            </Button>
            <br />
            <Button 
              className={ classes.smallButton + ' ' + classes.buttonBottomMargin }
              size="small"
              variant="outlined"
              onClick={ () => {} }
            >
              Remove <DeleteIcon className={ classes.iconSmall } />
            </Button>
          </div>
        </Grid>
      </Grid>
    )
  }

  getLocalParticipants() {
    const {
      classes,
      damlParticipants,
      visibleParticipant,
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

            const publicKey = entry.keyManager.publicKey
            const partiesVisible = publicKey == visibleParticipant

            return (
              <div key={ i }>
                <Grid container spacing={24}>
                  <Grid item xs={ 6 }>
                    <Typography variant="subtitle2">
                      { publicKey }
                    </Typography>
                    <Typography className={ classes.smallText }>
                      DAML ID: { entry.participant ? entry.participant.damlId : 'unregistered' }
                    </Typography>
                  </Grid>
                  <Grid item xs={ 6 } className={ classes.alignRight }>
                    { this.getLocalParticipantActions(entry) }
                  </Grid>
                </Grid>
                {
                  partiesVisible ? this.getLocalParties(entry) : null
                }
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
                <Typography className={ classes.smallText }>
                  DAML ID: { participant.damlId }
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