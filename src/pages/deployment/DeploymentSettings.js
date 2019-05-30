import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import DeploymentSettingsKeys from './DeploymentSettingsKeys'
import DeploymentSettingsDaml from './DeploymentSettingsDaml'

const styles = theme => ({
  root: {
    
  },
  paper: {
    padding: theme.spacing.unit * 5,
  },
})

const PAGES = [
  'Keys',
  'DAML',
]

const LOWER_CASE_PAGES = PAGES.map(page => page.toLowerCase())

class DeploymentSettings extends React.Component {

  getPage() {
    const {
      cluster,
      id,
      page,
      deployment,
      localKeys,
      remoteKeys,
    } = this.props

    if(page == 'keys') {
      return (
        <DeploymentSettingsKeys
          cluster={ cluster }
          id={ id }
          deployment={ deployment }
          localKeys={ localKeys }
          remoteKeys={ remoteKeys }
        />
      )
    }
    else if(page == 'daml') {
      return (
        <DeploymentSettingsDaml
          cluster={ cluster }
          id={ id }
          deployment={ deployment }
        />
      )
    }
    else {
      return `unknown page: ${page}`
    }
  }
  render() {
    const {
      classes,
      cluster,
      id,
      page,
      deployment,
      onViewPage,
    } = this.props

    const pageIndex = LOWER_CASE_PAGES.indexOf(page)

    return (
      <div className={ classes.root }>
        <AppBar position="static"  color="default">
          <Tabs
            value={ pageIndex }
            onChange={ (ev, value) => {
              const newPage = LOWER_CASE_PAGES[value]
              onViewPage(cluster, id, newPage)
            }}
            indicatorColor="primary"
            textColor="primary"
          >
            {
              PAGES.map((page, i) => (
                <Tab label={ page } key={ i } />
              ))
            }
          </Tabs>
        </AppBar>
        { this.getPage() }
      </div>
    )
  }
}

DeploymentSettings.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(DeploymentSettings)