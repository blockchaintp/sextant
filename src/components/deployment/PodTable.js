import React from 'react'

import SimpleTable from 'components/table/SimpleTable'
import DeletePodDialog from 'components/table/DeletePodDialog'
import SimpleTableActions from 'components/table/SimpleTableActions'

import settings from 'settings'

const DeleteIcon = settings.icons.delete

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
  state = {
    deleteConfirmOpen: false,
    selectedPod: null,
  }

  openDeleteDialog(selectedPod) {
    this.setState({
      deleteConfirmOpen: true,
      selectedPod,
    })
  }

  closeDeleteDialog() {
    this.setState({
      deleteConfirmOpen: false,
    })
  }

  render() {
    const {
      data,
      nodes,
      onDeletePod,
    } = this.props
    const {
      deleteConfirmOpen,
      selectedPod,
    } = this.state

    const nodesByName = (nodes || []).reduce((all, node) => {
      all[node.metadata.name] = node
      return all
    }, {})

    const tableData = data
      .map((pod) => {
        const containerStatuses = pod.status.containerStatuses || []
        const containerCount = containerStatuses.length
        const containersReady = containerStatuses.filter((currentStatus) => currentStatus.ready).length
        const containersCrashLoopBackoff = containerStatuses.filter((currentStatus) => currentStatus.state.waiting && currentStatus.state.waiting.reason === 'CrashLoopBackOff').length
        const containersPodInitializing = containerStatuses.filter((currentStatus) => currentStatus.state.waiting && currentStatus.state.waiting.reason === 'PodInitializing').length
        const containersImagePullBackOff = containerStatuses.filter((currentStatus) => currentStatus.state.waiting && currentStatus.state.waiting.reason === 'ImagePullBackOff').length

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

    const getActions = () => [
      {
        title: 'Delete',
        icon: DeleteIcon,
        handler: (pod) => this.openDeleteDialog(pod),
      },
    ]

    return (
      <div>
        <SimpleTable
          data={tableData}
          fields={fields}
          getActions={(item) => (
            <SimpleTableActions
              item={item}
              actions={getActions()}
            />
          )}
        />
        <DeletePodDialog
          open={deleteConfirmOpen}
          title={selectedPod ? `${selectedPod.name}` : null}
          onCancel={() => this.closeDeleteDialog()}
          onConfirm={() => {
            this.closeDeleteDialog()
            onDeletePod(selectedPod.name)
          }}
        />
      </div>
    )
  }
}

export default PodTable
