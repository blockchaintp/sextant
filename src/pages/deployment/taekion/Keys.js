import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 2,
  },
})

class TaekionKeys extends React.Component {

  render() {
    const {
      classes,
    } = this.props

    return (
      <div className={ classes.root }>
        <Grid container spacing={24}>
          <Grid item xs={ 12 }>
            KEYS
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles)(TaekionKeys)