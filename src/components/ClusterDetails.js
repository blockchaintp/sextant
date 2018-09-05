import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'


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

    const parts = data.reduce((all, row, i) => {
      return all.concat([
        <Grid
          key={ `title-${i}` }
          item
          xs={3}
        >
          <Typography
            variant='body2'
          >
            { row.title }
          </Typography>
        </Grid>,
        <Grid
          key={ `value-${i}` }
          item
          xs={9}
        >
          <Typography
            variant='body1'
          >
            { row.value }
          </Typography>
        </Grid>
      ])
    }, [])

    return (
      <Grid
        container
        direction='row'
        className={ classes.container }
      >

      { parts }

      </Grid>
    )
  }
}

ClusterDetails.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(ClusterDetails)