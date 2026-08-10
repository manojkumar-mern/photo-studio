import express from 'express';
import { createBooking, getBookings } from '../controllers/bookingController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route to submit bookings
router.post('/', createBooking);

// Protected route to retrieve all bookings (admin only)
router.get('/', protect, getBookings);

export default router;
