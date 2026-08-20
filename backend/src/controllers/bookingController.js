import Booking from '../models/Booking.js';
import { sendBookingEmails } from '../config/emailService.js';
import { sendAutomationEvent } from '../services/n8n/automation.service.js';

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { name, email, phone, service, date, scope, message } = req.body;

    // Basic required field validation
    if (!name || !email || !phone || !service || !date) {
      return res.status(400).json({
        status: 'error',
        message: 'Name, email, phone, service, and preferred date are required fields'
      });
    }

    // Map frontend 'scope' or backend 'message'
    const messageContent = scope || message || '';

    const newBooking = new Booking({
      name,
      email,
      phone,
      service,
      date: new Date(date),
      message: messageContent
    });

    const savedBooking = await newBooking.save();

    // Trigger confirmation and notification emails asynchronously
    sendBookingEmails(savedBooking);

    return res.status(201).json({
      status: 'success',
      message: 'Booking saved successfully',
      data: savedBooking
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        status: 'error',
        message: messages.join(', ')
      });
    }
    console.error('Error creating booking:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while saving booking'
    });
  }
};

// Retrieve all bookings (Admin protected)
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    return res.status(200).json({
      status: 'success',
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Error retrieving bookings:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while retrieving bookings'
    });
  }
};

// Delete a booking (Admin protected)
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBooking = await Booking.findByIdAndDelete(id);

    if (!deletedBooking) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking not found'
      });
    }

    // Trigger booking.cancelled event in the background (non-blocking)
    sendAutomationEvent('booking.cancelled', deletedBooking).catch((err) => {
      console.error('[n8n Service] Asynchronous booking.cancelled event failed:', err);
    });

    return res.status(200).json({
      status: 'success',
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while deleting booking'
    });
  }
};

// Update a booking (For Phase 5 testing & future extension)
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.body.status === 'booked') {
      req.body['payment.status'] = 'requested';
      req.body['payment.requestedAt'] = new Date();
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking not found'
      });
    }

    // Trigger status transition events or generic update event
    if (req.body.status !== undefined) {
      sendAutomationEvent('booking.status.updated', updatedBooking).catch((err) => {
        console.error('[n8n Service] Asynchronous booking.status.updated event failed:', err);
      });

      if (req.body.status === 'booked') {
        sendAutomationEvent('booking.booked', updatedBooking).catch((err) => {
          console.error('[n8n Service] Asynchronous booking.booked event failed:', err);
        });
        sendAutomationEvent('payment.requested', updatedBooking).catch((err) => {
          console.error('[n8n Service] Asynchronous payment.requested event failed:', err);
        });
      } else if (req.body.status === 'not_booked') {
        sendAutomationEvent('booking.not_booked', updatedBooking).catch((err) => {
          console.error('[n8n Service] Asynchronous booking.not_booked event failed:', err);
        });
      }
    } else {
      sendAutomationEvent('booking.updated', updatedBooking).catch((err) => {
        console.error('[n8n Service] Asynchronous booking.updated event failed:', err);
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Booking updated successfully',
      data: updatedBooking
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while updating booking'
    });
  }
};

