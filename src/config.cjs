const convict = require('convict')
const path = require('path')

const config = convict({
  env: {
    doc: 'Application environment.',
    format: ['development', 'production'],
    default: 'development',
    env: 'NODE_ENV'
  }
})

// Load environment dependent configuration
const env = config.get('env')
config.loadFile(path.resolve(process.cwd(), `config/${env}.json`))

// Perform validation
config.validate({ allowed: 'strict' })

module.exports = config
