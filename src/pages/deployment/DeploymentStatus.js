import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import TaskTable from 'components/task/TaskTable'
import PodTable from 'components/deployment/PodTable'
import ServiceTable from 'components/deployment/ServiceTable'
import VolumeTable from 'components/deployment/VolumeTable'
import SummaryValues from 'components/summary/SummaryValues'

const styles = (theme) => ({
  root: {
    padding: theme.spacing.unit * 2,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    margin: theme.spacing.unit * 2,
  },
})

class DeploymentStatus extends React.Component {
  render() {
    const {
      classes,
      resources,
      summary,
      tasks,
    } = this.props

    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs={8}>
            <Paper className={classes.paper}>
              <Typography variant="h6" gutterBottom>
                Pods
              </Typography>
              <PodTable
                data={resources.pods}
                nodes={resources.nodes}
              />
            </Paper>
            <Paper className={classes.paper}>
              <Typography variant="h6" gutterBottom>
                Services
              </Typography>
              <ServiceTable
                data={resources.services}
              />
            </Paper>
            <Paper className={classes.paper}>
              <Typography variant="h6" gutterBottom>
                Persistent Volume Claims
              </Typography>
              <VolumeTable
                data={resources.volumes}
              />
            </Paper>
            <Paper className={classes.paper}>
              <Typography variant="h6" gutterBottom>
                Tasks
              </Typography>
              <TaskTable
                data={tasks}
              />
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.paper}>
              <Typography variant="h6" gutterBottom>
                Summary
              </Typography>
              <SummaryValues
                data={summary}
              />
            </Paper>
          </Grid>
        </Grid>
      </div>
    )
  }
}

DeploymentStatus.propTypes = {
  classes: PropTypes.object.isRequired,
}

DeploymentStatus.defaultProps = {

}

export default withStyles(styles)(DeploymentStatus)
