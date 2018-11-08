import React from 'react'
import PropTypes from 'prop-types'
import { connectStore } from 'redux-box'
import { withStyles } from '@material-ui/core/styles'

import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Snackbar from '@material-ui/core/Snackbar'

import store from '../store'
import snackbarModule from '../store/snackbar'
import authModule from '../store/auth'

import AppBar from '../components/AppBar'
import AppFooter from '../components/AppFooter'

import settings from '../settings'

const styles = theme => ({
  fullHeight: {
    height: '100%'
  },
  content: {
    height: 'calc(100% - 64px)',
  },
  contentPaddingBottom: {
    height: '60px',
  }
})

@connectStore({
  snackbar: snackbarModule,
  auth: authModule,
})
class Layout extends React.Component {

  render() {
    const { classes, snackbar, auth } = this.props

    return (
      <div className={ classes.fullHeight }>
        <AppBar 
          title={ settings.title }
          user={ auth.userData }
          onLogout={ auth.logout }
        />
        <div className={ classes.content }>
          { this.props.children }
          <div className={ classes.contentPaddingBottom }>

          </div>
        </div>
        <AppFooter />
        <div>
          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            open={ snackbar.isOpen }
            autoHideDuration={3000}
            onClose={ snackbar.close }
            message={ <span id="message-id">{ snackbar.message }</span> }
          />
        </div>
      </div>
    )
  }
}

Layout.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Layout)