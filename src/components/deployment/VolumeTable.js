import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import SimpleTable from 'components/table/SimpleTable'

const styles = theme => {
  return {}
}

const fields =[{
  title: 'Name',
  name: 'name',
},{
  title: 'Status',
  name: 'status',
},{
  title: 'StorageClass',
  name: 'storageClass',
}]

class VolumeTable extends React.Component {
  
  render() {
    const { 
      classes,
      data,
    } = this.props

    const tableData = data
      .map(volume => {
        return {
          id: volume.metadata.name,
          name: volume.metadata.name,
          //age: timeago().format(volume.metadata.creationTimestamp).replace(' ago', ''),
          created: new Date(volume.metadata.creationTimestamp).toLocaleString(),
          //capacity: volume.spec.capacity.storage,
          status: volume.status.phase,
          storageClass: volume.spec.storageClassName,
          //claim: volume.spec.claimRef.name,
        }
      })

    return (
      <SimpleTable
        data={ tableData }
        fields={ fields }
      />
    )
  }
}

VolumeTable.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(VolumeTable)