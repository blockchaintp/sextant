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
}, {
  title: 'External IP',
  name: 'ip',
}, {
  title: 'CPU',
  name: 'cpu',
}, {
  title: 'RAM',
  name: 'ram',
}]

class NodeTable extends React.Component {
  
  render() {
    const { 
      classes,
      data,
    } = this.props

    console.dir(data)

    const tableData = data
      .map(node => {

        const externalIP = node.status.addresses.find(address => address.type == 'ExternalIP')
        return {
          id: node.metadata.name,
          name: node.metadata.name,
          ip: externalIP.address,
          cpu: node.status.allocatable.cpu,
          ram: node.status.allocatable.memory,
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

NodeTable.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(NodeTable)