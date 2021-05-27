import React from 'react'
import { withStyles } from '@material-ui/core/styles'

import SimpleTable from 'components/table/SimpleTable'

const styles = () => ({})

const fields = [{
  title: 'Name',
  name: 'name',
}, {
  title: 'Status',
  name: 'status',
}, {
  title: 'StorageClass',
  name: 'storageClass',
}]

class VolumeTable extends React.Component {
  render() {
    const {
      data,
    } = this.props

    const tableData = data
      .map((volume) => ({
        id: volume.metadata.name,
        name: volume.metadata.name,
        // age: timeago().format(volume.metadata.creationTimestamp).replace(' ago', ''),
        created: new Date(volume.metadata.creationTimestamp).toLocaleString(),
        // capacity: volume.spec.capacity.storage,
        status: volume.status.phase,
        storageClass: volume.spec.storageClassName,
        // claim: volume.spec.claimRef.name,
      }))

    return (
      <SimpleTable
        data={tableData}
        fields={fields}
      />
    )
  }
}

export default withStyles(styles)(VolumeTable)
