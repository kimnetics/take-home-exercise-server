import { type NextFunction, type Request, type Response } from 'express'

import { companyGet } from '../services/company.js'
import * as util from '../utils/util.js'

export const companyGetHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const response = await companyGet(req.app.get('db'))
    util.returnResponse(res, response.statusCode, response.body)
  } catch (err) {
    next(err)
  }
}
