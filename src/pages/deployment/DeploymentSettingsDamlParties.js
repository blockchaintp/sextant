/* eslint-disable jsx-a11y/anchor-is-valid */
/*
 * Copyright © 2020 Blockchain Technology Partners Limited All Rights Reserved
 *
 * License: Product
 */

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
const DownArrowIcon = settings.icons.downArrow
const KeyIcon = settings.icons.key

const styles = (theme) => ({
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
    },
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
    border: '1px dashed #e5e5e5',
  },
  warningText: {
    color: '#cc0000',
  },
})

class DeploymentSettingsDamlParties extends React.Component {
  state = {
    // eslint-disable-next-line react/no-unused-state
    addWindowOpen: false,
    // eslint-disable-next-line react/no-unused-state
    addWindowName: '',
    // eslint-disable-next-line react/no-unused-state
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

  getAddPartyDialog() {
    const {
      addPartyWindowOpen,
      addPartyName,
      setAddPartyName,
    } = this.props
    return (
      <Dialog
        open={addPartyWindowOpen}
        onClose={() => this.setFormOpen(false)}
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
              value={addPartyName}
              onChange={(e) => setAddPartyName(e.target.value)}
            />
          </div>

        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.setAddFormOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => this.submitAddForm()} variant="contained" color="secondary" autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  getTokenSettingsDialog() {
    const {
      classes,
      cluster,
      id,
      tokenSettingsWindowParticipant,
      setTokenSettingsWindowParticipant,
      selectedParties,
      applicationId,
      setApplicationId,
      setSelectedParty,
      generatePartyToken,
    } = this.props

    if (!tokenSettingsWindowParticipant) return null

    const {
      parties,
    } = tokenSettingsWindowParticipant

    const hasMember = Object.keys(selectedParties).find((name) => selectedParties[name] === 'read' || selectedParties[name] === 'act')
    const hasName = applicationId.match(/\w/)
    const isValid = hasMember && hasName

    return (
      <Dialog
        open={!!setTokenSettingsWindowParticipant}
        onClose={() => this.closeTokenSettingsDialog()}
        fullWidth
        maxWidth="md"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <Grid container spacing={8}>
            <Grid item xs={12}>
              <Typography variant="h6">Party Access Token</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="application-id"
                label="Application Id"
                style={{ margin: 8 }}
                helperText="Enter the application id for the token"
                fullWidth
                margin="normal"
                value={applicationId}
                onChange={(e) => setApplicationId(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1">Read As</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1">Act As</Typography>
            </Grid>
            <Grid item xs={6}>
              {
                parties.map((party, j) => (
                  <div key={j}>
                    <FormControlLabel
                      control={(
                        <Checkbox
                          className={classes.checkbox}
                          checked={!!(selectedParties[party.name] === 'read' || selectedParties[party.name] === 'act')}
                          onChange={(event) => {
                            setSelectedParty({
                              party: party.name,
                              value: event.target.checked ? 'read' : 'none',
                            })
                          }}
                          value={party.name}
                        />
                        )}
                      label={party.name}
                    />
                  </div>
                ))
              }
            </Grid>
            <Grid item xs={6}>
              {
                parties.map((party, j) => (
                  <div key={j}>
                    <FormControlLabel
                      control={(
                        <Checkbox
                          className={classes.checkbox}
                          checked={selectedParties[party.name] === 'act'}
                          onChange={(event) => {
                            setSelectedParty({
                              party: party.name,
                              value: event.target.checked ? 'act' : 'none',
                            })
                          }}
                          value={party.name}
                        />
                        )}
                      label={party.name}
                    />
                  </div>
                ))
              }
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    parties.forEach((party) => {
                      setSelectedParty({
                        party: party.name,
                        value: 'none',
                      })
                    })
                    return false
                  }}
                >
                  select none
                </a>
&nbsp;|&nbsp;
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    parties.forEach((party) => {
                      setSelectedParty({
                        party: party.name,
                        value: 'read',
                      })
                    })
                    return false
                  }}
                >
                  select all
                </a>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    parties.forEach((party) => {
                      setSelectedParty({
                        party: party.name,
                        value: 'none',
                      })
                    })
                    return false
                  }}
                >
                  select none
                </a>
&nbsp;|&nbsp;
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    parties.forEach((party) => {
                      setSelectedParty({
                        party: party.name,
                        value: 'act',
                      })
                    })
                    return false
                  }}
                >
                  select all
                </a>
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.closeTokenSettingsDialog()}>
            Close
          </Button>
          <Button
            variant="contained"
            color="secondary"
            disabled={!isValid}
            onClick={() => {
              const readAs = []
              const actAs = []
              Object.keys(selectedParties).forEach((party) => {
                if (selectedParties[party] === 'read') {
                  readAs.push(party)
                } else if (selectedParties[party] === 'act') {
                  readAs.push(party)
                  actAs.push(party)
                }
              })
              this.closeTokenSettingsDialog()
              generatePartyToken({
                cluster,
                id,
                applicationId,
                readAs,
                actAs,
              })
            }}
          >
            Create Token
            {' '}
            <KeyIcon className={classes.iconSmall} />
          </Button>
        </DialogActions>
      </Dialog>
    )
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
        open={tokenWindowOpen}
        onClose={() => this.closeTokenDialog()}
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
          <Typography gutterBottom className={classes.warningText}>
            <strong>Warning: </strong>
            {' '}
            you will not see this token again - make sure you keep it safe.
          </Typography>
          <CodeBlock
            code={tokenValue || ''}
            clipboard
            snackbarMessage={snackbarMessage}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.closeTokenDialog()}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  setVisibleParticipant(publicKey) {
    const {
      resetSelectedParties,
      setVisibleParticipant,
    } = this.props
    setVisibleParticipant(publicKey)
    resetSelectedParties()
  }

  getLocalParticipantActions(entry) {
    const {
      classes,
    } = this.props

    const { publicKey } = entry

    const toggleButton = (
      <Button
        className={`${classes.smallButton} ${classes.buttonMargin}`}
        size="small"
        variant="outlined"
        onClick={() => this.setVisibleParticipant(publicKey)}
      >
        <DownArrowIcon className={classes.iconSmall} />

      </Button>
    )

    return (
      <div>
        { toggleButton }
      </div>
    )
  }

  getLocalParties(entry) {
    const {
      classes,
      setTokenSettingsWindowParticipant,
    } = this.props

    const { publicKey } = entry
    const {
      parties,
    } = entry

    return (
      <Grid container spacing={0}>
        <Grid item xs={6}>
          <div className={classes.partyContainer}>
            {
              parties.map((party, j) => (
                <div key={j}>
                  <Typography>{ party.name }</Typography>
                </div>
              ))
            }
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className={classes.partyButtons}>
            <Button
              className={`${classes.smallButton} ${classes.buttonBottomMargin}`}
              size="small"
              variant="outlined"
              onClick={() => this.setAddFormOpen(true, publicKey)}
            >
              Add Party
              {' '}
              <AddIcon className={classes.iconSmall} />
            </Button>
            <br />
            <Button
              className={`${classes.smallButton} ${classes.buttonBottomMargin}`}
              size="small"
              variant="outlined"
              onClick={() => {
                setTokenSettingsWindowParticipant(entry)
              }}
            >
              Generate Tokens
              {' '}
              <KeyIcon className={classes.iconSmall} />
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
    } = this.props

    return (
      <>
        {
          participants.map((entry, i) => {
            const { publicKey } = entry
            const partiesVisible = publicKey === visibleParticipant

            return (
              <div key={i}>
                <Grid container spacing={24}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">
                      { entry.participantId }
                    </Typography>
                  </Grid>
                  <Grid item xs={6} className={classes.alignRight}>
                    {this.getLocalParticipantActions(entry) }
                  </Grid>
                </Grid>
                {
                  partiesVisible ? this.getLocalParties(entry) : null
                }
                <div className={classes.spacing} />
                <Divider />
                <div className={classes.spacing} />
              </div>
            )
          })
        }
      </>
    )
  }

  getPartiesByParticipant() {
    const {
      classes,
      participants,
    } = this.props

    const fields = [{
      title: 'Name',
      name: 'name',
    }]

    const allParticipants = participants
    return (
      <>
        {
          allParticipants.map((participant, i) => {
            const parties = participant ? participant.parties : []
            parties.sort((a, b) => {
              if (b.name.toLowerCase() === a.name.toLowerCase()) {
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
            const data = parties.map((party, j) => ({
              id: j,
              name: party.name,
            }))
            return (
              <div key={i} className={classes.denseTable}>
                <div className={classes.spacing} />
                <div className={classes.partyContainer}>
                  <SimpleTable
                    // hideHeader
                    data={data}
                    fields={fields}
                  />
                </div>
              </div>
            )
          })
        }
      </>
    )
  }

  closeTokenSettingsDialog() {
    const {
      setApplicationId,
      setSelectedParties,
      setTokenSettingsWindowParticipant,
    } = this.props
    setApplicationId('')
    setSelectedParties({})
    setTokenSettingsWindowParticipant(null)
  }

  closeTokenDialog() {
    const {
      setToken,
      setTokenWindowOpen,
    } = this.props
    setToken(null)
    setTokenWindowOpen(false)
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

  render() {
    const {
      classes,
    } = this.props

    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              <Typography variant="h6">
                Local Participants
              </Typography>
              <div className={classes.spacing} />
              {
                this.getLocalParticipants()
              }
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.paper}>
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
        { this.getTokenSettingsDialog() }
        { this.getTokenDialog() }
      </div>
    )
  }
}

DeploymentSettingsDamlParties.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(DeploymentSettingsDamlParties)
