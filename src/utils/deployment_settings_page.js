/* eslint-disable camelcase */

/*
 * Copyright © 2020 Blockchain Technology Partners Limited All Rights Reserved
 *
 * License: Product
 */

const FEATURE_TABS = {
  'sawtooth.identity': {
    id: 'keys',
    title: 'Sawtooth Identity',
  },
  'daml.parties': {
    id: 'damlParties',
    title: 'DAML Parties',
  },
  'daml.archives': {
    id: 'damlArchives',
    title: 'DAML Archives',
  },
  'daml.timekeeper': {
    id: 'damlTimeService',
    title: 'DAML Timekeeper',
  },
  'taekion.cli': {
    id: 'taekionCli',
    title: 'TFS CLI',
  },
  'taekion.keys': {
    id: 'taekionKeys',
    title: 'TFS Keys',
  },
  'taekion.volumes': {
    id: 'taekionVolumes',
    title: 'TFS Volumes',
  },
  'taekion.snapshots': {
    id: 'taekionSnapshots',
    title: 'TFS Snapshots',
    params: {
      volume: 'all',
    },
  },
  'taekion.explorer': {
    id: 'taekionExplorer',
    title: 'TFS Explorer',
    params: {
      volume: 'any',
      inode: 'root',
    },
  },
}

const getPages = function (features) {
  return features.map((feature) => FEATURE_TABS[feature])
}

const getFeaturesForDeployment = (
  deploymentForms,
  deployment_type,
  deployment_version,
) => deploymentForms[deployment_type]
  .button
  .versions
  .find((item) => (item.form === deployment_version)).features

const getFirstTagForDeployment = (deploymentForms, deployment_type, deployment_version) => {
  const features = getFeaturesForDeployment(deploymentForms, deployment_type, deployment_version)
  const pages = getPages(features)
  if (pages.length > 0) {
    return pages[0].id
  }
  return ''
}

module.exports = {
  getFirstTagForDeployment,
  getFeaturesForDeployment,
  getPages,
}
