import express from 'express'
import {
  registerNGO,
  loginNGO,
  requestItem,
  getNGORequests,
  confirmReceived,
  getAllNGONeeds
} from '../controllers/ngoController.js'

const router = express.Router()

// @route   POST /api/ngos/register (admin only, optional)
router.post('/register', registerNGO)

// @route   POST /api/ngos/login
router.post('/login', loginNGO)

// @route   POST /api/ngos/request
router.post('/request', requestItem)

// @route   GET /api/ngos/:id/requests
router.get('/:id/requests', getNGORequests)

// @route   PUT /api/ngos/:ngoId/confirm/:donationId
router.put('/:ngoId/confirm/:donationId', confirmReceived)

//@routes  GET /api/ngos/needs
router.get('/needs', getAllNGONeeds);

export default router
