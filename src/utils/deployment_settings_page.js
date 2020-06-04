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
  'taekion.keys': {
    id: 'taekionKeys',
    title: 'Taekion Keys',
  },
  'taekion.volumes': {
    id: 'taekionVolumes',
    title: 'Taekion Volumes',
  },
  'taekion.snapshots': {
    id: 'taekionSnapshots',
    title: 'Taekion Snapshots',
  },
}

const getPages = function (features) {
  return features.map(feature => FEATURE_TABS[feature])
}

const getFeaturesForDeployment = (deploymentForms, deployment_type, deployment_version) => {
    return deploymentForms[deployment_type].button.versions.find((item) => {
      return (item.form === deployment_version)
    }).features
}

const getFirstTagForDeployment = (deploymentForms, deployment_type, deployment_version) => {
  const features = getFeaturesForDeployment(deploymentForms, deployment_type, deployment_version)
  const pages=getPages(features)
  if (pages.length > 0) {
    return pages[0].id
  } else {
    return ""
  }
}

module.exports = {
  getFirstTagForDeployment,
  getFeaturesForDeployment,
  getPages,
}
