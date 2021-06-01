const getError = (data) => {
  if (!data) {
    return 'no error found'
  }
  if (typeof data === 'string') return data
  if (data.response && data.response.data) {
    const body = data.response.data
    return (body.error || body).toString()
  }

  return (data.error || data).toString()
}

const utils = {
  getError,
}

export default utils
