import React from 'react'
import { withStyles } from '@material-ui/core/styles'

import SimpleTable from 'components/table/SimpleTable'

const styles = () => ({})

const fields = [{
  title: 'Name',
  name: 'name',
}, {
  title: 'Ready',
  name: 'ready',
}, {
  title: 'Status',
  name: 'status',
}, {
  title: 'Pod IP',
  name: 'ip',
}, {
  title: 'Node IP',
  name: 'externalIP',
}]

class PodTable extends React.Component {
  render() {
    const {
      data,
      nodes,
    } = this.props

    const nodesByName = (nodes || []).reduce((all, node) => {
      all[node.metadata.name] = node
      return all
    }, {})

    const tableData = data
      .map((pod) => {
        const containerStatuses = pod.status.containerStatuses || []
        const containerCount = containerStatuses.length
        const containersReady = containerStatuses.filter((status) => status.ready).length
        const containersCrashLoopBackoff = containerStatuses.filter((status) => status.state.waiting && status.state.waiting.reason === 'CrashLoopBackOff').length
        const containersPodInitializing = containerStatuses.filter((status) => status.state.waiting && status.state.waiting.reason === 'PodInitializing').length
        const containersImagePullBackOff = containerStatuses.filter((status) => status.state.waiting && status.state.waiting.reason === 'ImagePullBackOff').length

        let status = pod.status.phase

        if (containersPodInitializing > 0) status = 'PodInitializing'
        if (containersImagePullBackOff > 0) status = 'ImagePullBackOff'
        if (containersCrashLoopBackoff > 0) status = 'CrashLoopBackOff'
        if (pod.metadata.deletionTimestamp) status = 'Terminating'

        const node = nodesByName[pod.spec.nodeName]
        const externalIP = node
          ? node.status.addresses.find((address) => address.type === 'ExternalIP')
          : {}

        return {
          id: pod.metadata.name,
          name: pod.metadata.name,
          ready: `${containersReady}/${containerCount}`,
          status,
          // age: timeago().format(pod.metadata.creationTimestamp).replace(' ago', ''),
          created: new Date(pod.metadata.creationTimestamp).toLocaleString(),
          ip: pod.status ? pod.status.podIP : '',
          externalIP: externalIP ? externalIP.address : '',
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

export default withStyles(styles)(PodTable)
