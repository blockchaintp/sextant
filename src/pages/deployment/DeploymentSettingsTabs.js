/* eslint-disable camelcase */
import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import withStyles from '@mui/styles/withStyles';
import AppBar from '@mui/material/AppBar'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

import { getPages } from 'utils/deployment_settings_page'

const styles = (theme) => ({
  root: {

  },
  paper: {
    padding: theme.spacing(5),
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

    const pages = getPages(features)

    const pageName = route.name.split('.')[1]
    if (pages.length === 0) {
      return (
        <div className={classes.root}>
          <AppBar position="static" color="default" />
        </div>
      )
    }
    let currentIndex = pages.findIndex((p) => p.id === pageName)
    if (currentIndex < 0) currentIndex = 0
    return (
      <div className={classnames(classes.root, 'deployment-settings-root')}>
        <AppBar position="static" color="default">
          <Tabs
            value={currentIndex}
            onChange={(ev, value) => {
              const nextPage = pages[value]
              onViewPage(cluster, id, deployment_type, deployment_version, nextPage.id, nextPage.params || {})
            }}
            indicatorColor="primary"
            textColor="primary"
          >
            {
              pages.map((page, i) => (
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
