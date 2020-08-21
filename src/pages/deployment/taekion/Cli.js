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

    const sextantApi = process.env.NODE_ENV == 'development' ?
      `http://api` :
      `${window.location.protocol}//${window.location.hostname}`

    const devCommands = process.env.NODE_ENV == 'development' ?
      ` --network sextant-dev_default ` :
      ''

    return (
      <div className={ classes.root }>
        <Grid container spacing={24}>
          <Grid item xs={4}></Grid>
          <Grid item xs={4}>
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
  -e SEXTANT_API_KEY=${accessToken} \\
  -e SEXTANT_API_URL=${sextantApi}/api/v1/clusters/${cluster}/deployments/${deployment}/taekion/rest_api \\
  binocarlos/taekion-client-wrapper`}
                clipboard={ true }
                snackbarMessage={ snackbarMessage }
              />
            </Paper>
          </Grid>
          <Grid item xs={4}></Grid>
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles)(TaekionCli)