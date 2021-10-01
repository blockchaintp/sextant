import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles';
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

import DeploymentTable from 'containers/deployment/DeploymentTable'
import TaskTable from 'components/task/TaskTable'
import NodeTable from 'components/cluster/NodeTable'
import SummaryValues from 'components/summary/SummaryValues'

const styles = (theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    margin: theme.spacing(2),
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
        <Grid container spacing={3}>
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
