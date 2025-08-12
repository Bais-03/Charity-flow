import express from 'express';
import multer from 'multer';
import upload from '../middleware/uploadMiddleware.js';
import {
  createDonation,
  getAllDonations,
  updateDonationStatus,
  getUserDonations,
  trackDonationById,
  matchDonationToNGORequest,
} from '../controllers/donationController.js';
import { protectAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router(); // ✅ Move this to top BEFORE router.get()

// @route   POST /api/donations
// @desc    Submit donation with image
router.post('/', upload.single('photo'), createDonation);

// @route   GET /api/donations
// @desc    Admin: get all donations
router.get('/', protectAdmin, getAllDonations);

// @route   GET /api/donations/user/:userId
// @desc    Get donation history of a user
router.get('/user/:userId', getUserDonations);

// @route   PUT /api/donations/:id/status
// @desc    Admin: accept/reject donation
router.put('/:id/status', protectAdmin, updateDonationStatus);

// @route   GET /api/donations/:id/track
// @desc    Admin/NGO: Track if item is submitted
router.get('/:id/track', protectAdmin, trackDonationById);


router.put('/:id/match-ngo', protectAdmin, matchDonationToNGORequest);

export default router;