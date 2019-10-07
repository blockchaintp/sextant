import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import { getPages } from 'utils/deployment_settings_page'

const styles = theme => ({
  root: {

  },
  paper: {
    padding: theme.spacing.unit * 5,
  },
})

class DeploymentSettings extends React.Component {

  render() {
    const {
      classes,
      cluster,
      id,
      deployment_type,
      deployment_version,
      features,
      route,
      onViewPage,
      children,
    } = this.props

    const [_, pageName] = route.name.split('.')
    if (getPages(features).length === 0) {
      return (
        <div className={classes.root}>
        <AppBar position="static" color="default">
        </AppBar>
      </div>
      )
    }

    const currentPage = getPages(features).find(p => p.id == pageName)
    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={currentPage.index}
            onChange={(ev, value) => {
              const nextPage = getPages(features)[value]
              onViewPage(cluster, id, deployment_type, deployment_version,nextPage.id)
            }}
            indicatorColor="primary"
            textColor="primary"
          >
            {
              getPages(features).map((page, i) => (
                <Tab label={page.title} key={i} />
              ))
            }
          </Tabs>
        </AppBar>
        {children}
      </div>
    )
  }
}

DeploymentSettings.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(DeploymentSettings)
