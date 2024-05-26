import type Database from 'better-sqlite3'

import { type Company } from '../models/company'
import { type ResponseInfo } from '../models/response-info'
import * as util from '../utils/util.js'

export const companyGet = async (db: Database.Database): Promise<ResponseInfo> => {
  const responseBody = db.prepare('SELECT * FROM company ORDER BY companyName').all() as Company[]
  return util.formatResponse(200, responseBody)
}
