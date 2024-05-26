import * as fs from 'fs'
import * as YAML from 'yaml'

const models = new Map<string, { [key: string]: any }>()

/*
 Gather properties for allOf.
 */
const gatherProperties = (allOf: { [key: string]: any }[]) => {
  let properties: { [key: string]: any } = {}

  allOf.forEach((entry) => {
    // Is entry a pointer to a model?
    if ('$ref' in entry) {
      // Get model name.
      const start = entry['$ref'].lastIndexOf('/') + 1
      const modelName = entry['$ref'].substring(start)

      // Exit if model has not yet been scanned.
      if (!models.has(modelName)) {
        throw new Error(`Model ${modelName} has not yet been scanned.`)
      }

      // Add properties from model.
      const modelProperties = models.get(modelName) as { [key: string]: any }
      Object.assign(properties, modelProperties)

      // Is entry a list of properties?
    } else if ('properties' in entry) {
      // Add properties from entry.
      const entryProperties = entry['properties'] as { [key: string]: any }
      Object.assign(properties, entryProperties)

    } else {
      throw new Error('allOf has an unexpected property.')
    }
  })

  return properties
}

/*
 Prepare openapi.yaml.
 */

// Read source openapi.yaml.
const inFile = fs.readFileSync('./src/models/openapi.yaml', 'utf8')

// Parse out schemas.
const openapi = YAML.parse(inFile)
if (!openapi.hasOwnProperty('components')) {
  throw new Error('openapi.yaml does not have a components property.')
}
const components = openapi['components']
if (!components.hasOwnProperty('schemas')) {
  throw new Error('components does not have a schemas property.')
}
const schemas = components['schemas']

// Loop through schemas.
Object.entries(schemas).forEach(([schemaName, value]) => {
  const schema = value as { [key: string]: any }

  // Does schema not have an allOf?
  if (!schema.hasOwnProperty('allOf')) {
    // Add schema to models.
    if (schema.hasOwnProperty('properties')) {
      models.set(schemaName, schema['properties'])
    }
  } else {
    // Gather properties for allOf.
    const properties = gatherProperties(schema['allOf'])

    // Replace allOf with gathered properties.
    delete schema['allOf']
    schema['properties'] = structuredClone(properties)

    // Add schema to models.
    models.set(schemaName, properties)
  }
})

// Write dist openapi.yaml.
fs.writeFileSync('./dist/models/openapi.yaml', YAML.stringify(openapi), 'utf8')
