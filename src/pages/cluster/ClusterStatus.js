import React from 'react'
import { styled } from '@mui/system';
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

import DeploymentTable from 'containers/deployment/DeploymentTable'
import TaskTable from 'components/task/TaskTable'
import NodeTable from 'components/cluster/NodeTable'
import SummaryValues from 'components/summary/SummaryValues'

const Root = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
}))

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(2),
}))

class ClusterStatus extends React.Component {
  render() {
    const {
      resources,
      summary,
      tasks,
    } = this.props

    return (
      <Root>
        <Grid container spacing={3}>
          <Grid item xs={9}>
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Nodes
              </Typography>
              <NodeTable
                data={resources.nodes}
              />
            </StyledPaper>
            <StyledPaper>
              <DeploymentTable
                embedded
              />
            </StyledPaper>
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Tasks
              </Typography>
              <TaskTable
                data={tasks}
              />
            </StyledPaper>
          </Grid>
          <Grid item xs={3}>
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Summary
              </Typography>
              <SummaryValues
                data={summary}
              />
            </StyledPaper>
          </Grid>
        </Grid>
      </Root>
    )
  }
}

export default ClusterStatus
