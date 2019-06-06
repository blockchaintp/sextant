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
      localValidatorKeys,
      localDamlRPCKeys,
      remoteKeys,
      damlParticipants,
      createRemoteKey,
      selectedParties,
      setSelectedParty,
      registerParticipant,
      rotateLocalDamlRPCKey,
      tokenDialogOpen,
      tokenValue,
      archives,
      timeService,
    } = this.props

    if(page == 'keys') {
      return (
        <DeploymentSettingsKeys
          cluster={ cluster }
          id={ id }
          deployment={ deployment }
          localValidatorKeys={ localValidatorKeys }
          localDamlRPCKeys={ localDamlRPCKeys }
          remoteKeys={ remoteKeys }
          createRemoteKey={ createRemoteKey }
        />
      )
    }
    else if(page == 'daml') {
      return (
        <DeploymentSettingsDaml
          cluster={ cluster }
          id={ id }
          deployment={ deployment }
          localValidatorKeys={ localValidatorKeys }
          localDamlRPCKeys={ localDamlRPCKeys }
          remoteKeys={ remoteKeys }
          damlParticipants={ damlParticipants }
          selectedParties={ selectedParties }
          setSelectedParty={ setSelectedParty }
          registerParticipant={ registerParticipant }
          rotateLocalDamlRPCKey={ rotateLocalDamlRPCKey }
          tokenDialogOpen={ tokenDialogOpen }
          tokenValue={ tokenValue }
          archives={ archives }
          timeService={ timeService }
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