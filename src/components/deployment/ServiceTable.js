/* eslint-disable max-len */
import React from 'react'

import SimpleTable from 'components/table/SimpleTable'

const fields = [{
  title: 'Name',
  name: 'name',
}, {
  title: 'Type',
  name: 'type',
}, {
  title: 'Ports',
  name: 'ports',
}, {
  title: 'ClusterIP',
  name: 'clusterIp',
}, {
  title: 'ExternalIP',
  name: 'externalIp',
}]

class ServiceTable extends React.Component {
  render() {
    const {
      data,
    } = this.props

    const tableData = data
      .map((service) => {
        const externalIp = service.status.loadBalancer && service.status.loadBalancer.ingress && service.status.loadBalancer.ingress[0] ? (
          service.status.loadBalancer.ingress[0].hostname || service.status.loadBalancer.ingress[0].ip
        ) : '<none>'
        return {
          // check to see if the value is defined before returning it otherwise return an empty string ---> value ? <return value> : <empty string>
          id: service.metadata.name,
          name: service.metadata.name,
          created: service.metadata.creationTimestamp ? new Date(service.metadata.creationTimestamp).toLocaleString() : '',
          type: service.spec.type ? service.spec.type : '',
          ports: (service.spec.ports && service.spec.ports.length > 0)
            ? service.spec.ports
              .map((port) => {
                const portDisplay = port.port === port.targetPort
                  ? port.port
                  : `${port.port}:${port.targetPort}`;
                return `${portDisplay}/${port.protocol}`;
              })
              .join(', ')
            : '',
          clusterIp: service.spec.clusterIP ? service.spec.clusterIP : '',
          externalIp,
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

export default ServiceTable
