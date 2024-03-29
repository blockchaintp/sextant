/* eslint-disable react/no-unused-state */
/* eslint-disable react/jsx-fragments */
/* eslint-disable jsx-a11y/anchor-is-valid */
/*
 * Copyright © 2023 Paravela Limited All Rights Reserved
 *
 * License: Product
 */

import React from 'react'
import { styled, GlobalStyles } from '@mui/system';
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'

import SimpleTable from 'components/table/SimpleTable'
import CodeBlock from 'components/code/CodeBlock'

import settings from 'settings'

const AddIcon = settings.icons.add
const DownArrowIcon = settings.icons.downArrow
const KeyIcon = settings.icons.key

const Root = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
}))

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: theme.spacing(2),
}))

const Spacing = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(2),
}))

const PartyButtonWrapper = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginLeft: theme.spacing(2),
}))

const PartyContainer = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  border: '1px dashed #e5e5e5',
}))

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
      setAddPartyPublicKey,
      resetSelectedParties,
    } = this.props
    setVisibleParticipant(null)
    setAddPartyWindowOpen(false)
    setAddPartyName('')
    setAddPartyPublicKey(null)
    resetSelectedParties()
  }

  setAddFormOpen(value, publicKey) {
    const {
      setAddPartyWindowOpen,
      setAddPartyName,
      setAddPartyPublicKey,
    } = this.props

    setAddPartyWindowOpen(value)
    setAddPartyName('')
    setAddPartyPublicKey(value ? publicKey : null)
  }

  getAddPartyDialog() {
    const {
      addPartyWindowOpen,
      addPartyName,
      addPartyIdHint,
      setAddPartyIdHint,
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
            <TextField
              id="party-id-hint"
              label="Party Id Hint"
              style={{ margin: 8 }}
              placeholder="Type the party ID hint here"
              helperText="Adding a party ID hint is optional."
              fullWidth
              margin="normal"
              value={addPartyIdHint}
              onChange={(e) => setAddPartyIdHint(e.target.value)}
            />
          </div>

        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.setAddFormOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => this.submitAddForm()} variant="contained" color="primary" autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  handleApplicationIdChange = (e) => {
    const { setApplicationId } = this.props
    setApplicationId(e.target.value)
  }

  handlePartySelectChange = (party, value) => {
    const { setSelectedParty } = this.props
    setSelectedParty({
      party,
      value,
    })
  }

  handleSelectAllNone = (value) => {
    const { tokenSettingsWindowParticipant } = this.props
    tokenSettingsWindowParticipant.parties.forEach((party) => {
      this.handlePartySelectChange(party.name, value)
    })
  }

  handleCreateToken = () => {
    const {
      admin,
      cluster,
      id,
      applicationId,
      selectedParties,
      generateAdminToken,
      generatePartyToken,
    } = this.props

    if (admin) {
      this.closeTokenSettingsDialog()
      generateAdminToken({
        cluster,
        id,
        applicationId,
      })
    } else {
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
    }
  }

  getTokenSettingsDialog() {
    const {
      tokenSettingsWindowParticipant,
      setTokenSettingsWindowParticipant,
      selectedParties,
      applicationId,
    } = this.props

    if (!tokenSettingsWindowParticipant) return null

    const {
      admin,
      parties,
    } = tokenSettingsWindowParticipant

    const hasMember = admin ? true : Object.keys(selectedParties).find((name) => selectedParties[name] === 'read' || selectedParties[name] === 'act')
    const hasName = applicationId.match(/\w/)
    const isValid = hasMember && hasName

    return (
      <Dialog
        open={!!setTokenSettingsWindowParticipant}
        onClose={this.closeTokenSettingsDialog}
        fullWidth
        maxWidth="md"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h6">
                { admin ? 'Admin' : 'Party' }
                {' '}
                Access Token
              </Typography>
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
                onChange={this.handleApplicationIdChange}
              />
            </Grid>
            {
              admin ? null : (
                <>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1">Read As</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1">Act As</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    {parties.map((party) => this.renderPartyCheckbox(party, 'read'))}
                  </Grid>
                  <Grid item xs={6}>
                    {parties.map((party) => this.renderPartyCheckbox(party, 'act'))}
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption">
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          this.handleSelectAllNone('none')
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
                          this.handleSelectAllNone('read')
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
                          this.handleSelectAllNone('none')
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
                          this.handleSelectAllNone('act')
                          return false
                        }}
                      >
                        select all
                      </a>
                    </Typography>
                  </Grid>
                </>
              )
            }
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.closeTokenSettingsDialog}>
            Close
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={!isValid}
            onClick={this.handleCreateToken}
          >
            Create Token
            {' '}
            <KeyIcon sx={{ marginLeft: 1, fontSize: 20 }} />
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  getTokenDialog() {
    const {
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
          <Typography gutterBottom sx={{ color: '#cc0000' }}>
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
    const { publicKey } = entry

    const toggleButton = (
      <Button
        sx={{ marginRight: 1, fontSize: '9px !important' }}
        size="small"
        variant="outlined"
        onClick={() => this.setVisibleParticipant(publicKey)}
      >
        <DownArrowIcon sx={{ marginLeft: 1, fontSize: 20 }} />

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
      setTokenSettingsWindowParticipant,
    } = this.props

    const { publicKey } = entry
    const {
      parties,
    } = entry

    return (
      <Grid container spacing={0}>
        <Grid item xs={6}>
          <PartyContainer>
            {
              parties.map((party) => (
                <div key={party.name}>
                  <Typography>{ party.name }</Typography>
                </div>
              ))
            }
          </PartyContainer>
        </Grid>
        <Grid item xs={6}>
          <PartyButtonWrapper>
            <Button
              sx={{ marginRight: 1, fontSize: '9px !important' }}
              size="small"
              variant="outlined"
              onClick={() => this.setAddFormOpen(true, publicKey)}
            >
              Add Party
              {' '}
              <AddIcon sx={{ marginLeft: 1, fontSize: 20 }} />
            </Button>
            <br />
            <Button
              sx={{ marginRight: 1, fontSize: '9px !important' }}
              size="small"
              variant="outlined"
              onClick={() => {
                setTokenSettingsWindowParticipant(entry)
              }}
            >
              Generate Tokens
              {' '}
              <KeyIcon sx={{ marginLeft: 1, fontSize: 20 }} />
            </Button>
          </PartyButtonWrapper>
        </Grid>
      </Grid>
    )
  }

  getLocalParticipants() {
    const {
      participants,
      visibleParticipant,
    } = this.props

    return (
      <React.Fragment>
        {
          participants.map((entry) => {
            const { publicKey } = entry
            const partiesVisible = publicKey === visibleParticipant

            return (
              <div key={entry.participantId}>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">
                      { entry.participantId }
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ textAlign: 'right' }}>
                    {this.getLocalParticipantActions(entry) }
                  </Grid>
                </Grid>
                {
                  partiesVisible ? this.getLocalParties(entry) : null
                }
                <Spacing />
                <Divider />
                <Spacing />
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
    } = this.props

    const fields = [{
      title: 'Name',
      name: 'name',
    }]

    const allParticipants = participants
    return (
      <>
        <GlobalStyles
          styles={{
            '.denseTable th, .denseTable td': {
              padding: '3px !important',
            },
            '.denseTable tr': {
              height: '30px !important',
            },
          }}
        />
        {
          allParticipants.map((participant) => {
            const parties = participant ? participant.parties : []
            const data = parties.map((party, j) => ({
              id: j,
              name: party.name,
            }))
            return (
              <div key={data.name} className={classes.denseTable}>
                <Spacing />
                <PartyContainer>
                  <SimpleTable
                    // hideHeader
                    data={data}
                    fields={fields}
                  />
                </PartyContainer>
              </div>
            )
          })
        }
      </>
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

  submitAddForm() {
    const {
      cluster,
      id,
      addParty,
      addPartyPublicKey,
      addPartyName,
      addPartyIdHint,
      setAddPartyWindowOpen,
    } = this.props
    setAddPartyWindowOpen(false)
    addParty({
      cluster,
      id,
      publicKey: addPartyPublicKey,
      partyName: addPartyName,
      partyIdHInt: addPartyIdHint,
    })
  }

  renderPartyCheckbox(party, value) {
    const { classes, selectedParties } = this.props
    return (
      <div key={party.name}>
        <FormControlLabel
          control={(
            <Checkbox
              className={classes.checkbox}
              checked={!!(selectedParties[party.name] === 'read' || selectedParties[party.name] === 'act')}
              onChange={(event) => {
                this.handlePartySelectChange(party.name, event.target.checked ? value : 'none')
              }}
              value={party.name}
            />
      )}
          label={party.name}
        />
      </div>
    )
  }

  render() {
    const {
      setTokenSettingsWindowParticipant,
    } = this.props

    return (
      <Root>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <StyledPaper>
              <Typography variant="h6">
                Local Participants
              </Typography>
              <Spacing />
              {
                this.getLocalParticipants()
              }
            </StyledPaper>
          </Grid>
          <Grid item xs={4}>
            <StyledPaper>
              <Typography variant="h6">
                All Parties
              </Typography>
              {
                this.getPartiesByParticipant()
              }
            </StyledPaper>
          </Grid>
          <Grid item xs={4}>
            <StyledPaper>
              <Typography variant="h6">
                Admin
              </Typography>
              <Button
                sx={{ marginRight: 1, fontSize: '9px !important' }}
                size="small"
                variant="outlined"
                onClick={() => {
                  setTokenSettingsWindowParticipant({
                    admin: true,
                    parties: [],
                  })
                }}
              >
                Generate Admin Token
                {' '}
                <KeyIcon sx={{ marginLeft: 1, fontSize: 20 }} />
              </Button>
            </StyledPaper>
          </Grid>
        </Grid>
        { this.getAddPartyDialog() }
        { this.getTokenSettingsDialog() }
        { this.getTokenDialog() }
      </Root>
    )
  }
}

export default DeploymentSettingsDamlParties
