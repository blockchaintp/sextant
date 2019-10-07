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
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'

import SimpleTable from 'components/table/SimpleTable'
import CodeBlock from 'components/code/CodeBlock'

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
    padding: theme.spacing.unit * 4,
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
  doubleSpacing: {
    marginTop: theme.spacing.unit * 4,
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
  },
  warningText: {
    color: '#cc0000',
  }
})

class DeploymentSettingsDamlParties extends React.Component {

  state = {
    addWindowOpen: false,
    addWindowName: '',
    addWindowPublicKey: null,
  }

  componentDidMount() {
    const {
      setVisibleParticipant,
      setAddPartyWindowOpen,
      setAddPartyName,
      setAddPartyPubicKey,
      resetSelectedParties,
    } = this.props
    setVisibleParticipant(null)
    setAddPartyWindowOpen(false)
    setAddPartyName('')
    setAddPartyPubicKey(null)
    resetSelectedParties()
  }

  setAddFormOpen(value, publicKey) {
    const {
      setAddPartyWindowOpen,
      setAddPartyName,
      setAddPartyPubicKey,
    } = this.props

    setAddPartyWindowOpen(value)
    setAddPartyName('')
    setAddPartyPubicKey(value ? publicKey : null)
  }

  submitAddForm() {
    const {
      cluster,
      id,
      addParty,
      addPartyPublicKey,
      addPartyName,
      setAddPartyWindowOpen,
    } = this.props
    setAddPartyWindowOpen(false)
    addParty({
      cluster,
      id,
      publicKey: addPartyPublicKey,
      partyName: addPartyName,
    })
  }

  getAddPartyDialog() {
    const {
      addPartyWindowOpen,
      addPartyName,
      setAddPartyName
    } = this.props
    return (
      <Dialog
        open={ addPartyWindowOpen }
        onClose={ () => this.setFormOpen(false) }
        fullWidth
        maxWidth="sm"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Add Party</DialogTitle>
        <DialogContent>
          <div>
            <TextField
              id="party-add"
              label="Party Name"
              style={{ margin: 8 }}
              placeholder="Type the name of the party here"
              helperText="Enter the name of the party you want to add to this participant"
              fullWidth
              margin="normal"
              value={ addPartyName }
              onChange={ (e) => setAddPartyName(e.target.value) }
            />
          </div>

        </DialogContent>
        <DialogActions>
          <Button onClick={ () => this.setAddFormOpen(false) }>
            Cancel
          </Button>
          <Button onClick={ () => this.submitAddForm() } variant="contained" color="secondary" autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  closeTokenDialog() {
    const {
      setToken,
      setTokenWindowOpen,
    } = this.props
    setToken(null)
    setTokenWindowOpen(false)
  }

  getTokenDialog() {
    const {
      classes,
      tokenWindowOpen,
      tokenValue,
      snackbarMessage,
    } = this.props
    return (
      <Dialog
        open={ tokenWindowOpen }
        onClose={ () => this.closeTokenDialog() }
        fullWidth
        maxWidth="sm"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Party Access Token</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Your Access Token is shown below.
          </Typography>
          <Typography gutterBottom className={ classes.warningText }>
            <strong>Warning: </strong> you will not see this token again - make sure you keep it safe.
          </Typography>
          <CodeBlock
            code={ tokenValue || '' }
            clipboard={ true }
            snackbarMessage={ snackbarMessage }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={ () => this.closeTokenDialog() }>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  setVisibleParticipant(publicKey) {
    const {
      resetSelectedParties,
      visibleParticipant,
      setVisibleParticipant,
    } = this.props
    setVisibleParticipant(publicKey)
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

    const publicKey = entry.publicKey

    const actionButton = /*entry? (
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
    ) : */ (
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

    const toggleButton = (
      <Button
        className={ classes.smallButton + ' ' + classes.buttonMargin }
        size="small"
        variant="outlined"
        onClick={ () => this.setVisibleParticipant(publicKey) }
      >
          <DownArrowIcon className={ classes.iconSmall } />

      </Button>
    )

    return (
      <div>
        { toggleButton }
        {/* { actionButton } */}
        {/* Leave action button commented out for now. */}
      </div>
    )
  }

  getLocalParties(entry) {
    const {
      classes,
      cluster,
      id,
      selectedParties,
      setSelectedParties,
      setSelectedParty,
      removeParties,
      generatePartyToken,
    } = this.props

    const publicKey = entry.publicKey
    const {
      parties,
    } = entry

    let checkedCount = 0

    parties.forEach(party => {
      if(selectedParties[party.name]) checkedCount++
    })

    const selectedPartyCount = Object.keys(selectedParties).reduce((all, partyName) => {
      return all + selectedParties[partyName] ? 1 : 0
    }, 0)

    return (
      <Grid container spacing={0}>
        <Grid item xs={ 6 }>
          <div className={ classes.partyContainer }>
            {
              parties.length > 0 && (
                <div>
                  <FormControlLabel
                    control={
                      <Checkbox
                        className={ classes.checkbox }
                        checked={ checkedCount > 0 && checkedCount >= parties.length }
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
              )
            }
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
              onClick={ () => this.setAddFormOpen(true, publicKey) }
            >
              Add Party <AddIcon className={ classes.iconSmall } />
            </Button>
            <br />
            <Button
              className={ classes.smallButton + ' ' + classes.buttonBottomMargin }
              size="small"
              variant="outlined"
              disabled={ selectedPartyCount == 0 }
              onClick={ () => {
                const partyNames = Object.keys(selectedParties)
                generatePartyToken({
                  cluster,
                  id,
                  publicKey,
                  partyNames,
                })
              } }
            >
              Generate Tokens <KeyIcon className={ classes.iconSmall } />
            </Button>
          </div>
        </Grid>
      </Grid>
    )
  }

  getLocalParticipants() {
    const {
      classes,
      participants,
      visibleParticipant,
      keyManagerKeys,
    } = this.props

    return (
      <React.Fragment>
        {
          participants.map((entry, i) => {

            const publicKey = entry.publicKey
            const partiesVisible = publicKey == visibleParticipant

            return (
              <div key={ i }>
                <Grid container spacing={24}>
                  <Grid item xs={ 6 }>
                    <Typography variant="subtitle2">
                      { entry.damlId }
                    </Typography>
                  </Grid>
                  <Grid item xs={ 6 } className={ classes.alignRight }>
                    {this.getLocalParticipantActions(entry) }
                  </Grid>
                  <Grid item xs={ 12 }>
                    <Typography className={ classes.smallText }>
                      Pubic Key: { publicKey }
                    </Typography>
                    {/* <Typography className={ classes.smallText }>
                      DAML ID: { entry.participant ? entry.participant.damlId : 'unregistered' }
                    </Typography> */}
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
      participants,
      keyManagerKeys,
    } = this.props

    const localKeyMap = keyManagerKeys.reduce((all, entry) => {
      all[entry.publicKey] = entry.name
      return all
    }, {})

    const fields =[{
      title: 'Name',
      name: 'name',
    }]

    let localParticipants = participants.filter(participant => {
      return localKeyMap[participant.publicKey] ? true : false
    })

    localParticipants = [localParticipants[0]]
    // This is currently not used but is left here for now
    // To be pruned in due course
    const remoteParticipants = participants.filter(participant => {
      return localKeyMap[participant.publicKey] ? false : true
    })

    const allParticipants = localParticipants
    return (
      <React.Fragment>
        {
          allParticipants.map((participant, i) => {
            const parties = participant ? participant.parties : []
            parties.sort((a,b)=> {

              if (b.name.toLowerCase() === a.name.toLowerCase() ) {
                if (a.name > b.name) {
                  return 1
                }
                if (b.name > a.name) {
                  return -1
                }
              }

              if (a.name.toLowerCase() > b.name.toLowerCase()) {
                return 1;
              }

              if (b.name.toLowerCase() > a.name.toLowerCase()) {
                return -1;
              }

              return 0;
            })
            const data = parties.map((party, j) => {
              return {
                id: j,
                name: party.name,
              }
            })
            return (
              <div key={ i } className={ classes.denseTable }>
                <div className={ classes.spacing }></div>
                {/* <Typography variant="subtitle2">
                { participant.publicKey.substring(0, 8) } - { localKeyMap[participant.publicKey] ? 'local' : 'remote' }
                </Typography> */}
                {/* <Typography className={ classes.smallText }>
                  Public Key: { participant.publicKey }
                </Typography> */}
                {/* <Typography className={ classes.smallText }>
                  DAML ID: { participant.damlId }
                </Typography> */}
                  <div className={ classes.partyContainer }>
                  <SimpleTable
                    // hideHeader
                    data={ data }
                    fields={ fields }
                  />
                  </div>
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
              <Typography variant="h6">
                Local Participants
              </Typography>
              <div className={ classes.spacing }></div>
              {
                this.getLocalParticipants()
              }
            </Paper>
          </Grid>
          <Grid item xs={ 6 }>
              <Paper className={ classes.paper }>
                <Typography variant="h6">
                  All Parties
                </Typography>
                {
                  this.getPartiesByParticipant()
                }
              </Paper>
            </Grid>
        </Grid>
        { this.getAddPartyDialog() }
        { this.getTokenDialog() }
      </div>
    )
  }
}

DeploymentSettingsDamlParties.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(DeploymentSettingsDamlParties)
