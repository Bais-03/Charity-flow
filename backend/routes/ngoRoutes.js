import express from 'express'
import {
  registerNGO,
  loginNGO,
  requestItem,
  getNGORequests,
  confirmReceived,
  getAllNGONeeds,
  allocateDonation,
  getNGODetails
} from '../controllers/ngoController.js'
import { protectAdmin } from '../middleware/adminMiddleware.js'

const router = express.Router()

// Admin-only NGO registration
router.post('/register', protectAdmin, registerNGO)

// NGO login
router.post('/login', loginNGO)

// NGO requests an item
router.post('/request', requestItem)

// Get all requests for an NGO
router.get('/:id/requests', getNGORequests)

// NGO confirms item received
router.put('/:ngoId/confirm/:donationId', confirmReceived)

// Get all NGO needs (admin)
router.get('/needs', getAllNGONeeds)

// Admin allocates donation to NGO
router.post('/allocate', protectAdmin, allocateDonation)

// Get NGO details by ID
router.get('/:id', getNGODetails)

export default router
