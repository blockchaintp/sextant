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
  regions: (state) => state.config.values.awsRegions || [],
  // a single region based on the given id
  region: (state, id) => aws.regions(state).filter(region => region.code == id)[0],
  // zones for a given region code
  zones: (state, id) => {
    const region = aws.region(state, id)
    if(!region) return []
    return region.zones
  },
}

const module = {
  router,
  aws,
}

export default module