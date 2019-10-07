const getPages = function (features) {

  let pages = []
  let counter=0
  if (features.includes("sawtooth.identity")) {
    pages.push({
      id: 'keys',
      title: 'Sawtooth Identity',
      index: counter++,
    })
  }
  if (features.includes("daml.parties")) {
    pages.push({
      id: 'damlParties',
      title: 'DAML Parties',
      index: counter++,
    })
  }
  if (features.includes("daml.archives")) {
    pages.push({
        id: 'damlArchives',
        title: 'DAML Archives',
        index: counter++,
      })
  }
  if (features.includes("daml.timekeeper")) {
    pages.push({
      id: 'damlTimeService',
        title: 'DAML Timekeeper',
      index: counter++,
    })
  }

  return pages;
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
  getPages,
}
