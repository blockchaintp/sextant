/* eslint-disable no-shadow */
const googleData = (data) => {
  if (!data) return {}
  const meta = data.meta || {}
  return meta.google || {}
}

const displayName = (data) => {
  const { innerDisplayName } = googleData(data)
  const { username } = data || {}
  return innerDisplayName || username
}

const emails = (data) => googleData(data).emails || []
const email = (data) => (emails(data)[0] || {}).value
const images = (data) => googleData(data).photos || []
const image = (data) => (images(data)[0] || {}).value
const activeProjectId = (data) => {
  if (!data) return null
  const meta = data.meta || {}
  return meta.activeInstallationId
}

const utils = {
  googleData,
  displayName,
  emails,
  email,
  images,
  image,
  activeProjectId,
}

export default utils
