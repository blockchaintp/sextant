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
  title: 'Type',
  name: 'type',
},{
  title: 'Ports',
  name: 'ports',
},{
  title: 'ClusterIP',
  name: 'clusterIp',
},{
  title: 'ExternalIP',
  name: 'externalIp',
}]

class ServiceTable extends React.Component {
  
  render() {
    const { 
      classes,
      data,
    } = this.props

    const tableData = data
      .map(service => {

        const externalIp = service.status.loadBalancer && service.status.loadBalancer.ingress ? (
          <a target="_blank" href={ `http://${service.status.loadBalancer.ingress[0].hostname}` }>
            { service.status.loadBalancer.ingress[0].hostname }
          </a>
        ) : '<none>'
        return {
          id: service.metadata.name,
          name: service.metadata.name,
          //created: timeago().format(service.metadata.creationTimestamp).replace(' ago', ''),
          created: new Date(service.metadata.creationTimestamp).toLocaleString(),
          type: service.spec.type,
          ports: service.spec.ports.map(port => `${ port.port == port.targetPort ? port.port : port.port + ':' + port.targetPort }/${port.protocol}`).join(', '),
          clusterIp: service.spec.clusterIP,
          externalIp,
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

ServiceTable.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(ServiceTable)