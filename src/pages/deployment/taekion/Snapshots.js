/* eslint-disable no-shadow */
import React from 'react'
import { styled } from '@mui/system'
import Button from '@mui/material/Button'
import SimpleTable from 'components/table/SimpleTable'
import SimpleTableHeader from 'components/table/SimpleTableHeader'
import SimpleTableActions from 'components/table/SimpleTableActions'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import FormWrapper from 'components/form/Wrapper'

import settings from 'settings'

const AddIcon = settings.icons.add

const HeaderActions = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'right',
  alignItems: 'center',
  paddingTop: '1.5rem !important',
})

const VolumeSelect = styled('div')(({ theme }) => ({
  marginRight: theme.spacing(2),
}))

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  margin: theme.spacing(1),
  minWidth: 200,
}))

const TABLE_FIELDS = [{
  title: 'Volume',
  name: 'volume_name',
}, {
  title: 'Name',
  name: 'name',
}]

const FORM_SCHEMA = [{
  id: 'volume',
  title: 'Volume',
  helperText: 'Choose the volume you want to take a snapshot for',
  component: 'select',
  validate: {
    type: 'string',
    methods: [
      ['required', 'Required'],
    ],
  },
}, {
  id: 'name',
  title: 'Name',
  helperText: 'The name of your snapshot (alphanumeric, no spaces or dashes)',
  component: 'text',
  validate: {
    type: 'string',
    methods: [
      ['required', 'Required'],
      ['matches', ['^[\\w]{1,128}$'], 'must be alphanumeric name, with no spaces or dashes and maximum 128 characters'],
    ],
  },
}]

const FORM_INITIAL_VALUES = {
  volume: '',
  name: '',
}

const splitSnapshotFormData = (payload) => {
  const {
    volume,
    ...currentData
  } = payload
  return {
    volume,
    currentData,
  }
}

class TaekionSnapshots extends React.Component {
  // this for when we click the "create snapshot" button on the volumes page
  // it redirects here with ?create=yes
  // so we remove the "create" param and then trigger the add modal
  componentDidMount() {
    const {
      params,
      onChangeVolume,
      onOpenAddSnapshotWindow,
    } = this.props

    if (params.create === 'yes') {
      const newParams = { ...params }
      delete (newParams.create)
      onChangeVolume(params.volume, newParams)
      onOpenAddSnapshotWindow()
    }
  }

  render() {
    const {
      classes,
      cluster,
      deployment,
      params,
      volume,
      volumes,
      snapshots,
      addSnapshotWindowOpen,
      addSnapshotError,
      onChangeVolume,
      onOpenAddSnapshotWindow,
      onCloseAddSnapshotWindow,
      onCreateSnapshot,
    } = this.props

    const onSubmitForm = (payload) => {
      const formData = splitSnapshotFormData(payload)
      onCreateSnapshot({
        cluster,
        deployment,
        volume: formData.volume,
        payload: formData.currentData,
      })
    }

    const volumesById = volumes.reduce((all, currentVolume) => {
      all[currentVolume.uuid] = currentVolume
      return all
    }, {})

    const data = snapshots.map((snapshot) => {
      if (snapshot == null) {
        return {}
      }
      const currentVolume = volumesById[snapshot.volumeuuid]
      return {
        id: `${snapshot.volume}-${snapshot.name}`,
        name: snapshot.name,
        volume: snapshot.volume,
        volume_name: currentVolume ? currentVolume.name : '',
      }
    })

    const volumeOptions = [{
      id: 'all',
      name: 'All',
    }].concat(volumes.map((currentVolume) => ({
      id: currentVolume.uuid,
      name: currentVolume.name,
    })))

    const headerActions = (
      <HeaderActions>
        <VolumeSelect>
          <StyledFormControl>
            <InputLabel htmlFor="name-readonly">Volume</InputLabel>
            <Select
              value={volume}
              label="Volume"
              onChange={(ev) => onChangeVolume(ev.target.value, params)}
            >
              {
                volumeOptions
                  .map((currentVolume, i) => (
                    <MenuItem
                      key={i}
                      value={currentVolume.id}
                    >
                      { currentVolume.name }
                    </MenuItem>
                  ))
              }
            </Select>
          </StyledFormControl>
        </VolumeSelect>
        <div className={classes.addButton}>
          <Button
            _ci="addbutton"
            id="addButton"
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={onOpenAddSnapshotWindow}
          >
            Add
            <AddIcon />
          </Button>
        </div>
      </HeaderActions>
    )

    const getActions = () => []

    const hooks = {
      validate: (values) => {
        const errors = {}
        if (values.volume === 'all') errors.volume = 'Please choose a volume'
        return errors
      },
      processItem: ({
        item,
      }) => {
        if (item.id === 'volume') {
          return {
            ...item,
            options: volumes.map((currentVolume) => ({
              title: currentVolume.name,
              value: currentVolume.uuid,
            })),
          }
        }
        return item
      },
    }

    const useInitialValues = { ...FORM_INITIAL_VALUES, volume }

    const simpleTableHeaderActions = () => headerActions

    const simpleTableActions = () => (
      <SimpleTableActions
        actions={getActions()}
      />
    )

    return (
      <div>
        <SimpleTableHeader
          title="Snapshots"
          getActions={simpleTableHeaderActions}
        />
        <SimpleTable
          pagination
          data={data}
          fields={TABLE_FIELDS}
          getActions={simpleTableActions}
        />
        {
          addSnapshotWindowOpen && (
            <FormWrapper
              schema={FORM_SCHEMA}
              initialValues={useInitialValues}
              error={addSnapshotError}
              onSubmit={onSubmitForm}
              hooks={hooks}
              renderForm={({
                content,
                handleSubmit,
              }) => (
                <Dialog
                  open
                  onClose={onCloseAddSnapshotWindow}
                  fullWidth
                  maxWidth="lg"
                  onKeyPress={(ev) => {
                    if (ev.key === 'Enter') {
                      ev.preventDefault();
                    }
                  }}
                >
                  <DialogTitle id="alert-dialog-title">Create Snapshot</DialogTitle>
                  <DialogContent>
                    { content }
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={onCloseAddSnapshotWindow}>
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary" autoFocus>
                      Create
                    </Button>
                  </DialogActions>
                </Dialog>
              )}
            />
          )
        }
      </div>
    )
  }
}

export default TaekionSnapshots
