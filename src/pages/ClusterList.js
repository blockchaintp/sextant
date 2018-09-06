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

import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'

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
    deleteClusterName: ''
  }

  componentDidMount(){
    this.props.cluster.loadList()
  }

  getStatusCell(phase) {

    const { classes } = this.props

    if(phase == 'creating' || phase == 'deleting') {
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

  onDeleteClick() {
    this.setState({
      deleteClusterName: ''
    })
  }

  getDeleteOKDisabled(ids) {
    const { classes, cluster } = this.props

    const id = ids[0]
    const deletingCluster = cluster.list.filter(c => c.settings.name == id)[0]

    if(!deletingCluster) return true
    if(deletingCluster.status.phase == 'deleted') return false

    return this.state.deleteClusterName != deletingCluster.settings.name
  }

  getDeleteDialogContent(ids) {

    const { classes, cluster } = this.props

    const id = ids[0]
    const deletingCluster = cluster.list.filter(c => c.settings.name == id)[0]

    if(!deletingCluster) return null

    if(deletingCluster.status.phase == 'deleted') {
      return (
        <DialogContent>
          <DialogContentText>
            This cluster is deleted - clicking the <strong>delete</strong> button below will cleanup and remove it from the system.
          </DialogContentText>
        </DialogContent>
      )
    }

    return (
      <DialogContent>
        <DialogContentText>
          Are you <strong>absolutely</strong> sure you want to delete the <strong>{ deletingCluster.settings.name }</strong> cluster?<br />
          To confirm - please type the name of the cluster (<strong>{ deletingCluster.settings.name }</strong>) into the textbox below:
        </DialogContentText>
        <FormControl
          fullWidth
        >
          <InputLabel 
            htmlFor='confirm-cluster-name'
          >
            enter the cluster name
          </InputLabel>
          <Input
            name='confirm-cluster-name'
            value={ this.state.deleteClusterName }
            onChange={ (e) => this.setState({
              deleteClusterName: e.target.value
            })}
          />
        </FormControl>
      </DialogContent>
    )
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
        onDelete={ (ids) => cluster.deleteCluster(ids[0]) }
        getOptions={ () => null }
        getDeleteDialogContent={ this.getDeleteDialogContent.bind(this) }
        getDeleteOKDisabled={ this.getDeleteOKDisabled.bind(this) }
        onDeleteClick={ this.onDeleteClick.bind(this) }
      /> 
    )
  }
}

ClusterList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ClusterList)