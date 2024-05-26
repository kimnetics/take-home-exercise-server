import { Router } from 'express'

import { healthCheckGetHandler } from '../../controllers/health-check.js'

const router = Router()

router.get('/', healthCheckGetHandler)

export default router
