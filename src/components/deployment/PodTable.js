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
  title: 'Ready',
  name: 'ready',
},{
  title: 'Status',
  name: 'status',
},{
  title: 'IP',
  name: 'ip',
}]

class PodTable extends React.Component {
  
  render() {
    const { 
      classes,
      data,
    } = this.props

    const tableData = data
      .map(pod => {

        const containerStatuses = pod.status.containerStatuses || []
        const containerCount = containerStatuses.length
        const containersReady = containerStatuses.filter(status => status.ready).length
        const containersCrashLoopBackoff = containerStatuses.filter(status => {
          return status.state.waiting && status.state.waiting.reason == 'CrashLoopBackOff'
        }).length

        let status = pod.status.phase

        if(containersCrashLoopBackoff > 0) status = 'CrashLoopBackOff'
        if(pod.metadata.deletionTimestamp) status = 'Terminating'

        return {
          id: pod.metadata.name,
          name: pod.metadata.name,
          ready: `${containersReady}/${containerCount}`,
          status,
          //age: timeago().format(pod.metadata.creationTimestamp).replace(' ago', ''),
          created: new Date(pod.metadata.creationTimestamp).toLocaleString(),
          ip: pod.status.podIP,
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

PodTable.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(PodTable)