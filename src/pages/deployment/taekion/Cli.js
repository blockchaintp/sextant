import React from 'react'
import withStyles from '@mui/styles/withStyles';
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CodeBlock from 'components/code/CodeBlock'

const styles = (theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(5),
  },
  button: {
    marginRight: theme.spacing(2),
  },
})

class TaekionCli extends React.Component {
  render() {
    const {
      classes,
      cluster,
      deployment,
      accessToken,
      snackbarMessage,
    } = this.props

    const auth = `bearer:${accessToken}`

    const sextantApi = process.env.NODE_ENV === 'development'
      ? `http://${auth}@api`
      : `${window.location.protocol}//${auth}@${window.location.hostname}`

    const devCommands = process.env.NODE_ENV === 'development'
      ? ' --network sextant-dev_default '
      : ''

    return (
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={0} md={2} />
          <Grid item xs={12} md={8}>
            <Paper className={classes.paper}>
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
            </Paper>
          </Grid>
          <Grid item xs={0} md={2} />
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles)(TaekionCli)
