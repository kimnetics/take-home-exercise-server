import { fileURLToPath } from 'url'
import path from 'path'
import express, { type ErrorRequestHandler, type Request, type Response } from 'express'
import * as OpenApiValidator from 'express-openapi-validator'

import { createDatabase } from './database/create-database.js'
import logger from './middleware/logger.js'
import v1Router from './routes/v1.js'
import * as util from './utils/util.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const app = express()

// Log requests.
const log = (req: Request, res: Response): void => {
  const ipAddress = req.headers['x-forwarded-for'] as string ?? req.ip
  const message = `Request | ${ipAddress} ${req.method} ${req.originalUrl} ${res.statusCode}`

  // Do not show bearer token.
  if ((req.headers.authorization !== undefined) && (req.headers.authorization.startsWith('Bearer'))) {
    req.headers.authorization = 'Bearer [REDACTED]'
  }

  const meta = {
    locals: res.locals,
    headers: req.headers,
    httpVersion: req.httpVersion
  }

  switch (res.statusCode.toString().charAt(0)) {
    case '4':
      logger.warn(message, meta)
      break
    case '5':
      logger.error(message, meta)
      break
    default:
      logger.info(message, meta)
  }
}
app.use((req, res, next) => {
  res.on('finish', () => { log(req, res) })
  next()
})

// Prepare database.
const db = createDatabase()
app.set('db', db)

// Add CORS headers.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  next()
})

// Serve home folder.
const homeFolder = path.join(dirname, 'public')
app.use(express.static(homeFolder))

// Serve OpenAPI spec.
const apiSpec = path.join(dirname, 'models', 'openapi.yaml')
app.use('/spec', express.static(apiSpec))

// Parse request bodies.
app.use(express.json())

// Validate requests.
app.use(
  OpenApiValidator.middleware({
    apiSpec
  })
)

// Serve API.
app.use('/v1', v1Router)

// Handle errors.
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  res.locals.message = err.message

  if (!('errors' in err)) {
    const error: Record<string, any> = {}
    Object.entries(err).forEach(([key, value]) => {
      error[key] = value
    })
    err.errors = [error]
  }

  const body = {
    message: err.message,
    errors: err.errors
  }
  util.returnResponse(res, 'status' in err ? err.status : 500, body)
}
app.use(errorHandler)

// Start server.
const port = 4000
app.listen(port, () => {
  logger.info(`API listening on port ${port}`)
})
