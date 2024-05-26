import { type NextFunction, type Request, type Response } from 'express'

import * as util from '../utils/util.js'

export const healthCheckGetHandler = (_req: Request, res: Response, next: NextFunction): void => {
  try {
    util.returnResponse(res, 200, {
      status: 'Healthy.'
    })
  } catch (err) {
    next(err)
  }
}
