import { Router } from 'express'

import { companyGetHandler } from '../../controllers/company.js'

const router = Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/', companyGetHandler)

export default router
