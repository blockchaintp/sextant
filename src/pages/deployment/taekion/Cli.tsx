import React from 'react'
import { styled } from '@mui/system';
import {
  Paper,
  Grid,
  Typography,
} from '@mui/material'
import CodeBlock from '../../../components/code/CodeBlock'

interface TaekionCliProps {
  cluster: string
  deployment: string
  accessToken: string
  snackbarMessage: (message: string) => void
}

const Root = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
}))

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
}))

const TaekionCli: React.FC<TaekionCliProps> = ({
  cluster,
  deployment,
  accessToken,
  snackbarMessage,
}) => {

  const auth = `bearer:${accessToken}`

  const sextantApi = process.env.NODE_ENV === 'development'
    ? `http://${auth}@api`
    : `${window.location.protocol}//${auth}@${window.location.hostname}`

  const devCommands = process.env.NODE_ENV === 'development'
    ? ' --network sextant-dev_default '
    : ''

  return (
    <Root>
      <Grid container spacing={3}>
        <Grid item xs={0} md={2} />
        <Grid item xs={12} md={8}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Taekion FS CLI
            </Typography>
            <Typography gutterBottom>
              Run the docker command below to use the taekion CLI commands on this deployment:
            </Typography>
            <CodeBlock
              code={`docker run -ti --rm ${devCommands} \\
--name tfs-cli \\
--privileged \\
--init \\
--device /dev/fuse \\
-e TFS_URL=${sextantApi}/api/v1/clusters/${cluster}/deployments/${deployment}/taekion/rest_api \\
taekion/taekion-fs-client:latest`}
              clipboard
              snackbarMessage={snackbarMessage}
            />
          </StyledPaper>
        </Grid>
        <Grid item xs={0} md={2} />
      </Grid>
    </Root>
  )
}

export default TaekionCli
