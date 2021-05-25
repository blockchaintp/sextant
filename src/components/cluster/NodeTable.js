import React from 'react'
import { withStyles } from '@material-ui/core/styles'

import SimpleTable from 'components/table/SimpleTable'

const styles = () => ({})

const fields = [{
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
      data,
    } = this.props

    console.dir(data)

    const tableData = data
      .map((node) => {
        const externalIP = node.status.addresses.find((address) => address.type === 'ExternalIP')
        return {
          id: node.metadata.name,
          name: node.metadata.name,
          ip: externalIP ? externalIP.address : '',
          cpu: node.status.allocatable.cpu,
          ram: node.status.allocatable.memory,
        }
      })

    return (
      <SimpleTable
        data={tableData}
        fields={fields}
      />
    )
  }
}

export default withStyles(styles)(NodeTable)
