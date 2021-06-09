import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import DeploymentTable from 'containers/deployment/DeploymentTable'
import TaskTable from 'components/task/TaskTable'
import NodeTable from 'components/cluster/NodeTable'
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

class ClusterStatus extends React.Component {
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
          <Grid item xs={9}>
            <Paper className={classes.paper}>
              <Typography variant="h6" gutterBottom>
                Nodes
              </Typography>
              <NodeTable
                data={resources.nodes}
              />
            </Paper>
            <Paper className={classes.paper}>
              <DeploymentTable
                embedded
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
          <Grid item xs={3}>
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

ClusterStatus.propTypes = {
  classes: PropTypes.object.isRequired,
}

ClusterStatus.defaultProps = {

}

export default withStyles(styles)(ClusterStatus)
