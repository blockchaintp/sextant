import React from 'react'
import PropTypes from 'prop-types'
import { styled } from '@mui/system';
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

import TaskTable from '../../components/task/TaskTable'
import PodTable from '../../components/deployment/PodTable'
import ServiceTable from '../../components/deployment/ServiceTable'
import VolumeTable from '../../components/deployment/VolumeTable'
import SummaryValues from '../../components/summary/SummaryValues'

const Root = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
}))

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(2),
}))

type Resources = {
  pods: never
  nodes: never
  services: never
  volumes: never
}

type DeploymentStatusProps = {
  resources: Resources
  summary: never
  tasks: never
  onDeletePod: (pod: any) => void
}

const DeploymentStatus: React.FC<DeploymentStatusProps> = ({
  resources,
  summary,
  tasks,
  onDeletePod,
}) => {

  return (
    <Root>
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Pods
            </Typography>
            <PodTable
              data={resources.pods}
              nodes={resources.nodes}
              onDeletePod={onDeletePod}
            />
          </StyledPaper>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Services
            </Typography>
            <ServiceTable
              data={resources.services}
            />
          </StyledPaper>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Persistent Volume Claims
            </Typography>
            <VolumeTable
              data={resources.volumes}
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
        <Grid item xs={4}>
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

export default DeploymentStatus
