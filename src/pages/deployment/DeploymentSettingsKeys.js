import React from 'react'
import { styled } from '@mui/system'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import {
  Grid,
  Paper,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'

import TextField from '@mui/material/TextField'

import SimpleTable from 'components/table/SimpleTable'
import SimpleTableHeader from 'components/table/SimpleTableHeader'

import settings from 'settings'

const AddIcon = settings.icons.add
const ClipboardIcon = settings.icons.clipboard

const Root = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
}))

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(2),
}))

const FormTextContainer = styled('div')(({ theme }) => ({
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
}))

const SmallText = styled('span')({
  fontSize: '0.7em',
})

const simpleTableActions = (item, snackbarMessage) => {
  const copyToClipboard = () => {
    snackbarMessage('Copied to clipboard')
  }

  return (
    <div>
      <CopyToClipboard text={item.publicKey} onCopy={copyToClipboard}>
        <Tooltip title="Copy to clipboard" placement="top">
          <IconButton size="large">
            <ClipboardIcon />
          </IconButton>
        </Tooltip>
      </CopyToClipboard>
    </div>
  )
}

const simpleTableHeaderActions = () => (
  <Button
    variant="contained"
    color="primary"
    onClick={() => this.setFormOpen(true)}
  >
    Add
    <AddIcon />
  </Button>
)

class DeploymentSettingsKeys extends React.Component {
  setFormOpen(value) {
    const {
      setAddEnrolledKeyDialogOpen,
      setAddEnrolledKeyValue,
    } = this.props
    setAddEnrolledKeyDialogOpen(value)
    setAddEnrolledKeyValue('')
  }

  getAddRemoteKeyDialog() {
    const {
      addEnrolledKeyDialogOpen,
      addEnrolledKeyValue,
      setAddEnrolledKeyValue,
    } = this.props
    return (
      <Dialog
        open={addEnrolledKeyDialogOpen}
        onClose={() => this.setFormOpen(false)}
        fullWidth
        maxWidth="sm"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Add Enrolled Key</DialogTitle>
        <DialogContent>
          <FormTextContainer>
            <TextField
              id="remote-key-add"
              label="Remote Key"
              style={{ margin: 8 }}
              placeholder="Paste the remote key here"
              helperText="You need to get the remote key from the cluster admin"
              fullWidth
              margin="normal"
              value={addEnrolledKeyValue}
              onChange={(e) => setAddEnrolledKeyValue(e.target.value)}
            />
          </FormTextContainer>

        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.setFormOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => this.submitAddForm()} variant="contained" color="primary" autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  getKeyManagerTable() {
    const {
      keyManagerKeys,
    } = this.props

    const fields = [{
      title: 'Name',
      name: 'name',
    }, {
      title: 'Public Key',
      name: 'key',
    }]

    const data = keyManagerKeys.map((entry) => ({
      id: entry.publicKey,
      publicKey: entry.publicKey,
      name: entry.name,
      key: (
        <SmallText>
          { entry.publicKey }
        </SmallText>
      ),
    }))

    return (
      <div>
        <SimpleTableHeader
          title="Local Keys"
        />
        <SimpleTable
          data={data}
          fields={fields}
          getActions={simpleTableActions}
        />
      </div>
    );
  }

  getEnrolledKeysTable() {
    const {
      enrolledKeys,
    } = this.props

    const fields = [{
      title: 'Public Key',
      name: 'key',
    }]

    const data = enrolledKeys.map((entry) => ({
      id: entry.publicKey,
      publicKey: entry.publicKey,
      key: (
        <SmallText>
          { entry.publicKey }
        </SmallText>
      ),
    }))

    return (
      <div>
        <SimpleTableHeader
          title="Allowed Keys"
          getActions={simpleTableHeaderActions}
        />
        <SimpleTable
          data={data}
          fields={fields}
        />
      </div>
    )
  }

  submitAddForm() {
    const {
      cluster,
      id,
      addEnrolledKeyValue,
      addEnrolledKey,
    } = this.props
    addEnrolledKey({
      cluster,
      id,
      publicKey: addEnrolledKeyValue,
    })
  }

  render() {
    return (
      <Root>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <StyledPaper>
              { this.getKeyManagerTable() }
            </StyledPaper>
          </Grid>
          <Grid item xs={6}>
            <StyledPaper>
              { this.getEnrolledKeysTable() }
            </StyledPaper>
          </Grid>
        </Grid>
        { this.getAddRemoteKeyDialog() }
      </Root>
    )
  }
}

export default DeploymentSettingsKeys
