import React from 'react'
import PropTypes from 'prop-types'
import { connectStore } from 'redux-box'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import { lighten } from '@material-ui/core/styles/colorManipulator'

import CircularProgress from '@material-ui/core/CircularProgress'
import OpenIcon from '@material-ui/icons/OpenInNew'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'

import settings from '../settings'
import clusterModule from '../store/cluster'

import withRouter from '../utils/withRouter'

import GenericTable from '../components/GenericTable'
import ConfirmDeleteClusterDialog from '../components/ConfirmDeleteClusterDialog'

const styles = theme => {
  return {
    progressContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    progress: {
      margin: theme.spacing.unit * 2,
    },
    deleteConfirmTextBox: {
      width: '100%'
    }
  }

}

@connectStore({
  cluster: clusterModule,
})
class ClusterList extends React.Component {
  
  state = {
    deleteCluster: null,
  }

  componentDidMount(){
    this.props.cluster.clusterListLoop()
  }

  componentWillUnmount() {
    this.props.cluster.stopClusterListLoop()
  }

  getStatusCell(phase) {

    const { classes } = this.props

    if(phase == 'creating' || phase == 'deleting' || phase == 'deploying') {
      return (
        <div className={ classes.progressContainer }>
          { phase }
          <CircularProgress
            className={ classes.progress }
            size={ 20 }
          />
        </div>
      )
    }
    else {
      return phase
    }
  }

  onDeleteClick(ids) {
    const { cluster } = this.props
    const id = ids[0]
    const deleteCluster = cluster.list.filter(c => c.settings.name == id)[0]
    this.setState({
      deleteCluster,
    })
  }

  onDeleteClose() {
    this.setState({
      deleteCluster: null,
    })
  }

  onDeleteConfirm() {
    const { cluster } = this.props
    cluster.deleteCluster(this.state.deleteCluster.settings.name)
    this.onDeleteClose()
  }

  render() {
    const { classes, cluster } = this.props
  
    const fields =[{
      title: 'Name',
      name: 'name',
    },{
      title: 'Domain',
      name: 'domain',
    },{
      title: 'Region',
      name: 'region',
    },{
      title: 'Size',
      name: 'size',
    },{
      title: 'Topology',
      name: 'topology',
    },{
      title: 'Status',
      name: 'status',
    }]

    const data = cluster.list.map(clusterData => {
      const { settings, status } = clusterData
      return {
        id: `${settings.name}`,
        name: `${settings.name}`,
        domain: `${settings.domain}`,
        region: `${settings.region}`,
        size: `masters: ${settings.master_size}, nodes: ${settings.node_size}`,
        topology: `${settings.topology}`,
        status: this.getStatusCell(status.phase),
      }
    })

    return (
      <div>
        <ConfirmDeleteClusterDialog
          cluster={ this.state.deleteCluster }
          onClose={ this.onDeleteClose.bind(this) }
          onConfirm={ this.onDeleteConfirm.bind(this) }
        />
        <GenericTable
          title="Cluster"
          noSelect
          data={ data }
          fields={ fields }
          onAdd={ cluster.add }
          icons={{
            edit: OpenIcon
          }}
          tooltips={{
            edit: 'View'
          }}
          onEdit={ (id) => cluster.viewCluster(id) }
          getOptions={ () => null }
          onDeleteClick={ this.onDeleteClick.bind(this) }
        />
      </div>
    )
  }
}

ClusterList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ClusterList)