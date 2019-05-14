import fields, { defaultValues } from './fields'
import dotty from 'dotty'

const flattenSchema = (schema) => {
  return schema
    .filter(item => typeof(item) === 'string' ? false : true)
    .reduce((all, row) => {
      return row.constructor === Array ?
        all.concat(row) :
        all.concat([row])
    }, [])
}

const flattenErrors = (errors, schema, baseKeys = []) => {
  let flatErrors = {}
  Object.keys(errors).forEach(key => {
    const value = errors[key]

    const fullKey = baseKeys.concat(key).join('.')

    if(typeof(value) == 'string') {
      const field = schema.find(field => field.id == fullKey)
      const errorKey = field ? field.title : fullKey
      flatErrors[errorKey] = value
    }
    else {
      flatErrors = Object.assign({}, flatErrors, flattenErrors(value, schema, baseKeys.concat([key])))
    }
  })
  return flatErrors
}

const getComponent = (component) => {
  let Component = typeof(component) === 'string' ?
      fields[component] :
      component

  if(!Component) Component = fields.text

  return Component
}

const getInitialValues = (schema, initialValues) => {
  const flatSchema = flattenSchema(schema)
  return flatSchema.reduce((all, field) => {
    const existing = dotty.get(all, field.id)
    if(!existing) {
      if(field.list) {
        dotty.put(all, field.id, [])
      }
      else if(typeof(field.default) !== 'undefined') {
        dotty.put(all, field.id, field.default)
      }
    }
    return all
  }, Object.assign({}, initialValues))
}

const processValues = (schema, values) => {
  const flatSchema = flattenSchema(schema)
  const returnValues = JSON.parse(JSON.stringify(values))
  return flatSchema.reduce((all, field) => {
    if(field.dataType) {
      let value = dotty.get(all, field.id)
      if(field.dataType == 'boolean') {
        value = (value === 'true' || value === true)
      }
      dotty.put(all, field.id, value)
      return all
    }
    else {
      return all
    }
  }, returnValues)
}

const utils = {
  flattenSchema,
  flattenErrors,
  getComponent,
  getInitialValues,
  processValues,
}

export default utils