import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import InfoPanel from './InfoPanel'

const styles = theme => {
  return {
    root: {
      
    },
  }
}

class ClusterDetails extends React.Component {

  render() {
    const { classes, cluster } = this.props
    const { settings, status } = cluster

    const data = [{
      title: 'Name:',
      value: settings.name,
    },{
      title: 'Domain:',
      value: settings.domain,
    },{
      title: 'Region:',
      value: settings.region,
    },{
      title: 'Topology:',
      value: settings.topology,
    },{
      title: 'Masters:',
      value: settings.master_size,
    },{
      title: 'Master Type:',
      value: settings.master_type,
    },{
      title: 'Master Zones:',
      value: settings.master_zones.join(', '),
    },{
      title: 'Nodes:',
      value: settings.master_size,
    },{
      title: 'Node Type:',
      value: settings.node_type,
    },{
      title: 'Node Zones:',
      value: settings.node_zones.join(', '),
    }]

    return (
      <InfoPanel
        data={ data }
      />
    )
  }
}

ClusterDetails.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(ClusterDetails)