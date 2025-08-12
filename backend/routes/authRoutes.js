import express from 'express'
import { adminLogin } from '../controllers/authController.js'

const router = express.Router()

router.post('/login', adminLogin) // final route: /api/admin/login

export default router