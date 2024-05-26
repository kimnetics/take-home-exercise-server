import { type NextFunction, type Request, type Response } from 'express'

import { customerGet } from '../services/customer.js'
import * as util from '../utils/util.js'

export const customerGetHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filter = req.query.filter as string
    const sort = req.query.sort as string
    const limit = req.query.limit as string
    const response = await customerGet(req.app.get('db'), filter, sort, limit)
    util.returnResponse(res, response.statusCode, response.body)
  } catch (err) {
    next(err)
  }
}
