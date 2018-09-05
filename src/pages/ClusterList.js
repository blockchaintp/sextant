import React from 'react'
import PropTypes from 'prop-types'
import { connectStore } from 'redux-box'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import { lighten } from '@material-ui/core/styles/colorManipulator'

import CircularProgress from '@material-ui/core/CircularProgress'
import OpenIcon from '@material-ui/icons/OpenInNew'

import settings from '../settings'
import clusterModule from '../store/cluster'

import withRouter from '../utils/withRouter'

import GenericTable from '../components/GenericTable'

const styles = theme => {
  return {
    progressContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    progress: {
      margin: theme.spacing.unit * 2,
    },
  }

}

@connectStore({
  cluster: clusterModule,
})
class ClusterList extends React.Component {
  
  componentDidMount(){
    this.props.cluster.loadList()
  }

  getStatusCell(phase) {

    const { classes } = this.props

    if(phase == 'creating') {
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
        onDelete={ () => null }
        getOptions={ () => null }
      /> 
    )
  }
}

ClusterList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ClusterList)