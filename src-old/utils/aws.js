const getInstanceCPUTitle = (title) => {
  const parts = (title || '').split('vCPUs')
  const baseSize = parts[0] || ''
  return `${baseSize} vCPUs`
}

const getInstanceTitle = (awsInstance) => {
  return `${ awsInstance.name } (${ awsInstance.apiName } / ${awsInstance.memory} / ${getInstanceCPUTitle(awsInstance.vCPUs)})`
}

const getRegionTitle = (awsRegion) => `${ awsRegion.name } - ${ awsRegion.code }`

const getRoute53Domains = (rawApiResponse) => {
  return (rawApiResponse.HostedZones || []).map(zone => zone.Name)
}


const awsUtils = {
  getInstanceTitle,
  getInstanceCPUTitle,
  getRegionTitle,
  getRoute53Domains,
}

export default awsUtils