import { Router } from 'express'

import { customerGetHandler } from '../../controllers/customer.js'

const router = Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/', customerGetHandler)

export default router
