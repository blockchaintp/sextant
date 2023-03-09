/* eslint-disable no-shadow */
import dotty from 'dotty'
import fields from './fields'

const flattenSchema = (schema) => schema
  .filter((item) => typeof item !== 'string')
  .reduce((all, row) => (row.constructor === Array ? all.concat(row) : all.concat([row])), [])

const flattenErrors = (errors, schema, baseKeys = []) => {
  let flatErrors = {}
  Object.keys(errors).forEach((key) => {
    const value = errors[key]

    const fullKey = baseKeys.concat(key).join('.')

    if (typeof value === 'string') {
      const field = schema.find((currentField) => currentField.id === fullKey)
      const errorKey = field ? field.title : fullKey
      flatErrors[errorKey] = value
    } else {
      flatErrors = { ...flatErrors, ...flattenErrors(value, schema, baseKeys.concat([key])) }
    }
  })
  return flatErrors
}

const getComponent = (component) => {
  let Component = typeof component === 'string' ? fields[component] : component

  if (!Component) Component = fields.text

  return Component
}

const getInitialValues = (schema, initialValues) => {
  const flatSchema = flattenSchema(schema)
  return flatSchema.reduce(
    (all, field) => {
      const existing = dotty.get(all, field.id)
      if (!existing) {
        if (field.list) {
          dotty.put(all, field.id, field.default || [])
        } else if (typeof field.default !== 'undefined') {
          dotty.put(all, field.id, field.default)
        }
      } else if (field.list && field.list.extractField) {
        // explode a list of strings back into an array of objects
        // with the value set on the "extractField" prop of the list
        // this is so we can still use the form list editor
        // for a list of strings rather than list of objects
        const valueArray = existing.map((primitiveValue) => ({
          [field.list.extractField]: primitiveValue,
        }))
        dotty.put(all, field.id, valueArray)
        return all
      }
      return all
    },
    { ...initialValues },
  )
}

const processInitialValues = (schema, initialValues) => {
  const flatSchema = flattenSchema(schema)
  return flatSchema.reduce(
    (all, field) => {
      const existing = dotty.get(all, field.id)
      if (field.list && field.list.extractField) {
        const valueArray = existing.map((primitiveValue) => ({
          [field.list.extractField]: primitiveValue,
        }))
        dotty.put(all, field.id, valueArray)
        return all
      }
      return all
    },
    { ...initialValues },
  )
}

const processValues = (schema, values) => {
  const flatSchema = flattenSchema(schema)
  const returnValues = JSON.parse(JSON.stringify(values))
  return flatSchema.reduce((all, field) => {
    if (field.dataType) {
      let value = dotty.get(all, field.id)
      if (field.dataType === 'boolean') {
        value = value === 'true' || value === true
      }
      dotty.put(all, field.id, value)
      return all
    }
    if (field.list && field.list.extractField) {
      // we are extracting a single field from each object in the list
      const objectValues = dotty.get(all, field.id)
      const valueArray = objectValues.map((obj) => obj[field.list.extractField])
      dotty.put(all, field.id, valueArray)
      return all
    }
    return all
  }, returnValues)
}

const utils = {
  flattenSchema,
  flattenErrors,
  getComponent,
  getInitialValues,
  processInitialValues,
  processValues,
}

export default utils
