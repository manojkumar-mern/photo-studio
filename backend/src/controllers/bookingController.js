import Booking from '../models/Booking.js';

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
