import React from 'react'
import PropTypes from 'prop-types'
import { connectStore } from 'redux-box'
import { withStyles } from '@material-ui/core/styles'

import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'

import withRouter from '../utils/withRouter'
import selectors from '../store/selectors'

const styles = theme => ({
  root: {
    height: '100%'
  },
  tabs: {
    
  }
})

@withRouter()
@withStyles(styles)
class SiteLayout extends React.Component {
  handleChange(value) {
    const { router, routerPush } = this.props
    routerPush(value, router.payload)
  }

  render() {
    const { classes, router } = this.props
    const route = router.routesMap[router.type]

    return (
      <div className={classes.root}>
        <AppBar 
          position="static"
          color="default"
          className={ classes.tabs }
        >
          <Tabs
            value={ route.tab || router.type } 
            onChange={ (ev, value) => this.handleChange(value) }
            indicatorColor="primary"
            textColor="primary"
            fullWidth
          >
            <Tab label="Create New" value="PAGE_CLUSTER_ADD_NEW"  />
            <Tab label="Join Existing" value="PAGE_CLUSTER_ADD_EXISTING"  />
          </Tabs>
        </AppBar>
        { this.props.children }
      </div>
    )
  }
}

export default SiteLayout