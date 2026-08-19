import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        if (!v) return true; // Optional field
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Please provide a valid email address'
    }
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  service: {
    type: String,
    required: [true, 'Service type is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Preferred date is required']
  },
  message: {
    type: String,
    trim: true
  },
  crm: {
    provider: {
      type: String,
      default: 'zoho'
    },
    status: {
      type: String,
      enum: ['pending', 'synced', 'failed', 'updated'],
      default: 'pending'
    },
    zohoLeadId: {
      type: String,
      default: null
    },
    lastAttemptAt: {
      type: Date,
      default: null
    },
    attempts: {
      type: Number,
      default: 0
    },
    lastError: {
      type: String,
      default: null
    },
    syncedAt: {
      type: Date,
      default: null
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

bookingSchema.index({ createdAt: -1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
