/* eslint-disable no-useless-constructor */
import * as React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'

import SimpleTable from 'components/table/SimpleTable'
import SimpleTableHeader from 'components/table/SimpleTableHeader'
import SimpleTableActions from 'components/table/SimpleTableActions'

import FormWrapper from 'components/form/Wrapper'

import settings from 'settings'

const AddIcon = settings.icons.add
const EditIcon = settings.icons.edit
const ViewArchiveIcon = settings.icons.viewArchive
const CreateArchiveIcon = settings.icons.createArchive

const TABLE_FIELDS = [{
  title: 'Name',
  name: 'name',
}, {
  title: 'Compression',
  name: 'compression',
}, {
  title: 'Encryption',
  name: 'encryption',
}, {
  title: 'Key',
  name: 'key',
}]

const FORM_SCHEMA = [{
  id: 'name',
  title: 'Name',
  helperText: 'The name of your volume (alphanumeric, no spaces or dashes)',
  component: 'text',
  validate: {
    type: 'string',
    methods: [
      ['required', 'Required'],
      ['matches', ['^[\\w]{1,128}$'], 'must be alphanumeric name, with no spaces or dashes and maximum 128 characters'],
    ],
  },
}, [{
  id: 'encryption',
  title: 'Encryption',
  helperText: 'Choose the type of encryption you want for your volume',
  component: 'select',
  options: [{
    title: 'None',
    value: 'NONE',
  }, {
    title: 'AES_GCM',
    value: 'AES_GCM',
  }],
  validate: {
    type: 'string',
    methods: [
      ['required', 'Required'],
    ],
  },
}, {
  id: 'fingerprint',
  title: 'Encryption Key',
  helperText: 'Choose the key you want to use to encrypt this volume',
  component: 'select',
  validate: {
    type: 'string',
  },
}], [{
  id: 'compression',
  title: 'Compression',
  helperText: 'Choose the type of compression you want for your volume',
  component: 'select',
  options: [{
    title: 'None',
    value: 'NONE',
  }, {
    title: 'LZ4',
    value: 'LZ4',
  }],
  validate: {
    type: 'string',
    methods: [
      ['required', 'Required'],
    ],
  },
}, ' ']]

const FORM_INITIAL_VALUES = {
  name: '',
  compression: 'NONE',
  encryption: 'NONE',
  fingerprint: '',
}

class TaekionVolumes extends React.Component {
  // const [editVolume, setEditVolume] = React.useState(null);
  state = {
    editVolume: null,
  }

  constructor(props) {
    super(props)
  }

  render() {
    const {
      classes,
      cluster,
      params,
      deployment,
      keys,
      volumes,
      addVolumeWindowOpen,
      addVolumeError,
      updateVolumeError,
      onOpenAddVolumeWindow,
      onCloseAddVolumeWindow,
      onCreateVolume,
      onUpdateVolume,
      onViewSnapshots,
      onCreateSnapshot,
    } = this.props

    const {
      editVolume,
    } = this.state

    const onSubmitForm = (payload) => {
      onCreateVolume({
        cluster,
        deployment,
        payload,
      })
    }

    const onSubmitEditedForm = (payload) => {
      onUpdateVolume({
        cluster,
        deployment,
        volume: editVolume.id,
        payload,
      })
      this.setState({
        editVolume: null,
      })
    }

    const onEditVolume = (item) => this.setState({
      editVolume: item,
    })

    const onCancelEditVolume = () => {
      this.setState({
        editVolume: null,
      })
      onCloseAddVolumeWindow()
    }

    const getKeyName = (fingerprintValue, allKeys) => {
      const foundKey = allKeys.find((item) => item.fingerprint === fingerprintValue)
      return foundKey ? foundKey.label : 'NONE'
    }
    const data = volumes.map((volume) => ({
      id: volume.uuid,
      name: volume.name,
      compression: volume.compression,
      encryption: volume.encryption,
      key: getKeyName(volume.fingerprint, keys),
    }))

    const headerActions = (
      <div className={classes.headerActions}>
        <div className={classes.addButton}>
          <Button
            _ci="addbutton"
            id="addButton"
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={onOpenAddVolumeWindow}
          >
            Add
            <AddIcon />
          </Button>
        </div>
      </div>
    )

    const getActions = (item) => [{
      title: 'View Snapshots',
      icon: ViewArchiveIcon,
      handler: () => onViewSnapshots(item.id, params),
    }, {
      title: 'Create Snapshot',
      icon: CreateArchiveIcon,
      handler: () => onCreateSnapshot(item.id, params),
    }, {
      title: 'Edit',
      icon: EditIcon,
      handler: onEditVolume,
    }]

    const hooks = {
      validate: (values) => {
        const errors = {}
        if (values.encryption !== 'NONE' && !values.fingerprint && !editVolume) {
          errors.fingerprint = 'You must select a key to use for encryption'
        }
        return errors
      },
      processItem: ({
        item,
      }) => {
        if (item.id === 'fingerprint') {
          // eslint-disable-next-line prefer-object-spread
          return Object.assign({}, item, {
            options: keys.map((key) => ({
              title: key.label,
              value: key.fingerprint,
            })),
          })
        }
        return item
      },
      hidden: ({
        item,
        values,
      }) => {
        if (item.id === 'fingerprint') return values.encryption === 'NONE'
        return false
      },
      disabled: ({
        item,
        values,
      // eslint-disable-next-line no-unneeded-ternary
      }) => (item.id !== 'name' && values.id ? true : false),
    }

    return (
      <div>
        <SimpleTableHeader
          title="Volumes"
          getActions={() => headerActions}
        />
        <SimpleTable
          pagination
          data={data}
          fields={TABLE_FIELDS}
          getActions={(item) => (
            <SimpleTableActions
              item={item}
              actions={getActions(item)}
            />
          )}
        />
        {
          addVolumeWindowOpen && (
            <FormWrapper
              schema={FORM_SCHEMA}
              initialValues={FORM_INITIAL_VALUES}
              error={addVolumeError}
              onSubmit={onSubmitForm}
              hooks={hooks}
              renderForm={({
                content,
                handleSubmit,
              }) => (
                <Dialog
                  open
                  onClose={onCloseAddVolumeWindow}
                  fullWidth
                  maxWidth="lg"
                  onKeyPress={(ev) => {
                    if (ev.key === 'Enter') {
                      ev.preventDefault();
                    }
                  }}
                >
                  <DialogTitle id="alert-dialog-title">Add Volume</DialogTitle>
                  <DialogContent>
                    { content }
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={onCloseAddVolumeWindow}>
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary" autoFocus>
                      Add
                    </Button>
                  </DialogActions>
                </Dialog>
              )}
            />
          )
        }
        {
          editVolume && (
            <FormWrapper
              schema={FORM_SCHEMA}
              initialValues={editVolume}
              error={updateVolumeError}
              onSubmit={onSubmitEditedForm}
              hooks={hooks}
              renderForm={({
                content,
                handleSubmit,
              }) => (
                <Dialog
                  open
                  onClose={onCancelEditVolume}
                  fullWidth
                  maxWidth="lg"
                  onKeyPress={(ev) => {
                    if (ev.key === 'Enter') {
                      ev.preventDefault();
                    }
                  }}
                >
                  <DialogTitle id="alert-dialog-title">Edit Volume</DialogTitle>
                  <DialogContent>
                    {content}
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={onCancelEditVolume}>
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary" autoFocus>
                      Edit
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

export default TaekionVolumes
