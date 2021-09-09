export const mergeEntities = (existingData, newData) => {
  Object.keys(newData.entities).forEach((name) => {
    existingData.entities[name] = {
      ...existingData.entities[name],
      ...newData.entities[name],
    }
  })
}

export const mergeAll = (existingData, newData) => {
  mergeEntities(existingData, newData)
  existingData.result = newData.result
}
