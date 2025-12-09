import { Router } from 'express'
import { login } from '../../controllers/v1/auth.controller'
const router = Router()

router.get('/login', login)

export default router
