import { jsonc } from 'jsonc'
import { format } from 'logform'
import winston from 'winston'
import NewrelicTransport from 'winston-newrelic-agent-transport'

// @ts-expect-error: Convict configuration file.
import config from '../config.cjs'

let options: winston.LoggerOptions
if (config.get('env') === 'development') {
  options = {
    format: format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
      format.metadata({ fillExcept: ['level', 'message', 'timestamp'] }),
      format.align(),
      format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}${(Object.entries(info.metadata).length > 0) ? ' | ' + jsonc.stringify(info.metadata) : ''}`)
    ),
    transports: [
      new winston.transports.Console({
        level: 'debug'
      }),
      new NewrelicTransport({
        level: 'debug'
      })
    ]
  }
} else {
  options = {
    format: format.combine(
      format.metadata({ fillExcept: ['level', 'message', 'timestamp'] }),
      format.json()
    ),
    transports: [
      new winston.transports.Console({
        level: 'info'
      }),
      new NewrelicTransport({
        level: 'info',
        rejectCriteria: [
          {
            property: 'metadata.headers.user-agent',
            regex: '^ELB-HealthChecker'
          }
        ]
      })
    ]
  }
}

const logger = winston.createLogger(options)

export default logger
