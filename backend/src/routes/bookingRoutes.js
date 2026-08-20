import express from 'express';
import { createBooking, getBookings, deleteBooking, updateBooking } from '../controllers/bookingController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route to submit bookings
router.post('/', createBooking);

// Protected route to retrieve all bookings (admin only)
router.get('/', protect, getBookings);

// Protected route to update a booking (admin only)
router.patch('/:id', protect, updateBooking);

// Protected route to delete a booking (admin only)
router.delete('/:id', protect, deleteBooking);

export default router;

