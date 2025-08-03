import express from 'express'
import multer from 'multer'
import upload from '../middleware/uploadMiddleware.js'; // 👈 import from your new file
// import { storage } from '../utils/cloudinary.js'
import {
  createDonation,
  getAllDonations,
  updateDonationStatus,
  getUserDonations,
  trackDonationById,
} from '../controllers/donationController.js'

// const upload = multer({ storage })
const router = express.Router()

// @route   POST /api/donations
// @desc    Submit donation with image
router.post('/', upload.single('photo'), createDonation)

// @route   GET /api/donations
// @desc    Admin: get all donations
router.get('/', getAllDonations)

// @route   GET /api/donations/user/:userId
// @desc    Get donation history of a user
router.get('/user/:userId', getUserDonations)

// @route   PUT /api/donations/:id/status
// @desc    Admin: accept/reject donation
router.put('/:id/status', updateDonationStatus)

// @route   GET /api/donations/:id/track
// @desc    Admin/NGO: Track if item is submitted
router.get('/:id/track', trackDonationById)

export default router
