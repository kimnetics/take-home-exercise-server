import { Router } from 'express'

import companyRouter from './v1/company.js'
import customerRouter from './v1/customer.js'
import healthCheckRouter from './v1/health-check.js'

const router = Router()

router.use('/companies', companyRouter)
router.use('/customers', customerRouter)
router.use('/health-check', healthCheckRouter)

export default router
