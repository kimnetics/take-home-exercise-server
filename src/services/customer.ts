import type Database from 'better-sqlite3'

import { type Customer } from '../models/customer'
import { type ResponseInfo } from '../models/response-info'
import * as util from '../utils/util.js'

export const customerGet = async (db: Database.Database, filter: string | undefined, sort: string | undefined): Promise<ResponseInfo> => {
  let whereClause = ''
  if (filter !== undefined && (filter !== '')) {
    const separator = filter.indexOf('|')
    const field = filter.substring(0, separator)
    const value = filter.substring(separator + 1)
    whereClause = `WHERE ${field} = '${value}'`
  }

  let orderByFields = 'firstName, lastName'
  if (sort !== undefined && sort !== '') {
    const separator = sort.indexOf('|')
    const field = sort.substring(0, separator)
    const sortOrder = sort.substring(separator + 1)
    switch (field.toLowerCase()) {
      case 'firstname':
        orderByFields = `firstName ${sortOrder}, lastName ${sortOrder}`
        break
      case 'lastname':
        orderByFields = `lastName ${sortOrder}, firstName ${sortOrder}`
        break
      default:
        orderByFields = `companyName ${sortOrder}, firstName ${sortOrder}, lastName ${sortOrder}`
    }
  }

  const responseBody = db.prepare(`SELECT * FROM customer ${whereClause} ORDER BY ${orderByFields}`).all() as Customer[]
  return util.formatResponse(200, responseBody)
}
