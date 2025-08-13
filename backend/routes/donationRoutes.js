import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { spamFilter } from '../middleware/spamFilter.js'; // Import spam filter
import {
  createDonation,
  getAllDonations,
  updateDonationStatus,
  getUserDonations,
  trackDonationById,
  matchDonationToNGORequest,
} from '../controllers/donationController.js';
import { protectAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// @route   POST /api/donations
// @desc    Submit donation with image (spam filter + file upload)
// Middleware order: spamFilter -> upload -> controller
router.post('/', spamFilter, upload.single('photo'), createDonation);

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
// @desc    Admin/NGO: Track donation status
router.get('/:id/track', protectAdmin, trackDonationById);

// @route   PUT /api/donations/:id/match-ngo
// @desc    Admin: Match donation to NGO request
router.put('/:id/match-ngo', protectAdmin, matchDonationToNGORequest);

export default router;
