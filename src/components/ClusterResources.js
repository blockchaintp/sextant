import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import timeago from 'timeago.js'

import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import GenericTableSimple from './GenericTableSimple'

const styles = theme => {
  return {
    button: {
      margin: theme.spacing.unit,
    },
    buttonRow: {
      marginBottom: theme.spacing.unit * 2,
    },
    resources: {
      padding: theme.spacing.unit * 2,
      backgroundColor: '#f5f5f5',
      border: '1px dashed #ccc',
      overflow: 'auto',
    },
    title: {
      marginBottom: theme.spacing.unit * 2,
    },
    tableHeader: {
      marginTop: theme.spacing.unit * 2,
      marginBottom: theme.spacing.unit * 2,
    },
  }
}

class ClusterResources extends React.Component {

  hasXoDemo() {
    const { info } = this.props
    if(!info.xodemo) return false
    if(!info.xodemo.status.loadBalancer) return false
    if(!info.xodemo.status.loadBalancer.ingress) return false
    return true
  }

  getServiceButtons() {
    const { classes, phase } = this.props

    if(phase != 'deployed') return null
      
    return (
      <div className={ classes.buttonRow }>
        <Button 
          className={ classes.button }
          color="primary" 
          variant="contained"
          size="small"
          autoFocus
          onClick={ () => this.props.onOpenDashboard() }
        >
          Open Dashboard
        </Button>
        <Button 
          className={ classes.button }
          color="primary" 
          variant="contained"
          size="small"
          autoFocus
          onClick={ () => this.props.onOpenMonitoring() }
        >
          Open Monitoring
        </Button>
        {
          this.hasXoDemo() ? (
            <Button 
              className={ classes.button }
              color="primary" 
              variant="contained"
              size="small"
              autoFocus
              onClick={ () => this.props.onOpenXoDemo() }
            >
              Open XO Demo
            </Button>
          ) : null
        }
      </div>
    )
  }

  getPodTable() {

    const { info, classes } = this.props

    const fields =[{
      title: 'Name',
      name: 'name',
    },{
      title: 'Age',
      name: 'age',
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

    const pods = info.podJson ? info.podJson.items : []

    const data = pods
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
          name: pod.metadata.name,
          ready: `${containersReady}/${containerCount}`,
          status,
          age: timeago().format(pod.metadata.creationTimestamp).replace(' ago', ''),
          ip: pod.status.podIP,
        }
      })

    return (
      <div>
        <Typography
          variant='h6'    
          className={ classes.tableHeader }
        >
          Pods
        </Typography>

        <GenericTableSimple
          fields={ fields }
          data={ data }
          padding='dense'
        />
      </div>
    )
  }


  getServiceTable() {

    const { info, classes } = this.props

    const fields =[{
      title: 'Name',
      name: 'name',
    },{
      title: 'Age',
      name: 'age',
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

    const services = info.serviceJson ? info.serviceJson.items : []

    const data = services
      .map(service => {

        const externalIp = service.status.loadBalancer && service.status.loadBalancer.ingress ? (
          <a target="_blank" href={ `http://${service.status.loadBalancer.ingress[0].hostname}` }>
            { service.status.loadBalancer.ingress[0].hostname }
          </a>
        ) : '<none>'
        return {
          name: service.metadata.name,
          age: timeago().format(service.metadata.creationTimestamp).replace(' ago', ''),
          type: service.spec.type,
          ports: service.spec.ports.map(port => `${ port.port == port.targetPort ? port.port : port.port + ':' + port.targetPort }/${port.protocol}`).join(', '),
          clusterIp: service.spec.clusterIP,
          externalIp,
        }
      })

    return (
      <div>
        <Typography
          variant='h6'  
          className={ classes.tableHeader }        
        >
          Services
        </Typography>

        <GenericTableSimple
          fields={ fields }
          data={ data }
          padding='dense'
        />
      </div>
    )
  }

  getPersistentVolumeTable() {

    const { info, classes } = this.props

    const fields =[{
      title: 'Name',
      name: 'name',
    },{
      title: 'Age',
      name: 'age',
    },{
      title: 'Capacity',
      name: 'capacity',
    },{
      title: 'Status',
      name: 'status',
    },{
      title: 'StorageClass',
      name: 'storageClass',
    },{
      title: 'Claim',
      name: 'claim',
    }]

    const volumes = info.pvJson ? info.pvJson.items : []

    const data = volumes
      .map(volume => {
        return {
          name: volume.metadata.name,
          age: timeago().format(volume.metadata.creationTimestamp).replace(' ago', ''),
          capacity: volume.spec.capacity.storage,
          status: volume.status.phase,
          storageClass: volume.spec.storageClassName,
          claim: volume.spec.claimRef.name,
        }
      })

    return (
      <div>
        <Typography
          variant='h6'  
          className={ classes.tableHeader }        
        >
          Volumes
        </Typography>

        <GenericTableSimple
          fields={ fields }
          data={ data }
          padding='dense'
        />
      </div>
    )
  }

  render() {

    const { classes, info, phase } = this.props

    if(!info) return null

    return (
      <div>
        { this.getServiceButtons() }

        { this.getPodTable() }

        { this.getServiceTable() }

        { this.getPersistentVolumeTable() }

      </div>
    )
  }
}

ClusterResources.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(ClusterResources)