const router = {
  payload: (state) => state.location.payload,
  currentPage: (state) => state.location.type,
  currentRoute: (state) => {
    const pageName = router.currentPage(state)
    return state.location.routesMap[pageName]
  }
}

const module = {
  router,
}

export default module