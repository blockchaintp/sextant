import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import CodeBlock from 'components/code/CodeBlock'

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 2,
  },
  paper: {
    padding: theme.spacing.unit * 5,
  },
  button: {
    marginRight: theme.spacing.unit * 2,
  },
})

class TaekionCli extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {

    const { 
      classes,
      cluster,
      deployment,
      accessToken,
      snackbarMessage,
    } = this.props

    const auth = `bearer:${accessToken}`

    const sextantApi = process.env.NODE_ENV == 'development' ?
      `http://${auth}@api` :
      `${window.location.protocol}//${auth}@${window.location.hostname}`

    const devCommands = process.env.NODE_ENV == 'development' ?
      ` --network sextant-dev_default ` :
      ''

    return (
      <div className={ classes.root }>
        <Grid container spacing={24}>
          <Grid item xs={0} md={2}></Grid>
          <Grid item xs={12} md={8}>
            <Paper className={ classes.paper }>
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
                clipboard={ true }
                snackbarMessage={ snackbarMessage }
              />
            </Paper>
          </Grid>
          <Grid item xs={0} md={2}></Grid>
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles)(TaekionCli)