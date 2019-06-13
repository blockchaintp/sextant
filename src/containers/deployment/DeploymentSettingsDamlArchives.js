import React from 'react'
import { connect } from 'react-redux'

import deploymentSettingsActions from 'store/modules/deploymentSettings'
import selectors from 'store/selectors'

import DeploymentSettingsDamlArchives from 'pages/deployment/DeploymentSettingsDamlArchives'

@connect(
  state => {

    const routeParams = selectors.router.params(state)

    const {
      cluster,
      id,
    } = routeParams

    return {
      cluster,
      id,
      archives: selectors.deploymentSettings.archives(state),
      uploadArchiveWindowOpen: selectors.deploymentSettings.uploadArchiveWindowOpen(state),
      inProgress: selectors.fileupload.inProgress(state),
      error: selectors.fileupload.error(state),
      status: selectors.fileupload.status(state),
    }
  },
  {
    setUploadArchiveWindowOpen: deploymentSettingsActions.setUploadArchiveWindowOpen,
    uploadArchive: deploymentSettingsActions.uploadArchive,
  },
)
class DeploymentSettingsDamlArchivesContainer extends React.Component {

  render() {
    return (
      <DeploymentSettingsDamlArchives 
        {...this.props}
      />
    )
  }
}

export default DeploymentSettingsDamlArchivesContainer