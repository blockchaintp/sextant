const router = {
  payload: (state) => state.location.payload,
  currentPage: (state) => state.location.type,
  currentRoute: (state) => {
    const pageName = router.currentPage(state)
    return state.location.routesMap[pageName]
  }
}

const aws = {
  // array of region data
  regions: (state) => state.config.aws.regions || [],
  // a single region based on the given id
  region: (state, id) => aws.regions(state).filter(region => region.code == id)[0],
  // zones for a given region code
  zones: (state, id) => {
    const region = aws.region(state, id)
    if(!region) return []
    return region.zones
  },
}

const form = {
  data: (state, formName) => state.form[formName] || {},
  fieldNames: (state, formName) => {
    const formData = form.data(state, formName)
    const allFields = formData.registeredFields || {}
    return Object.keys(allFields)
  },
  values: (state, formName) => {
    const formData = form.data(state, formName)
    return formData.values || {}
  },
  errors: (state, formName) => {
    const formData = form.data(state, formName)
    return formData.syncErrors || {}
  },
  errorMessages: (state, formName) => {
    const errors = form.errors(state, formName)
    return Object.keys(errors).map(key => {
      return `${key}: ${errors[key]}`
    })
  },
  hasError: (state, formName) => {
    const errors = form.errors(state, formName)
    return Object.keys(errors).length > 0
  },
}

const module = {
  router,
  aws,
  form,
}

export default module