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
  n8n: {
    status: {
      type: String,
      enum: ['pending', 'sent', 'failed'],
      default: 'pending'
    },
    sentAt: {
      type: Date,
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
    }
  },
  portfolio: {
    status: {
      type: String,
      enum: ['pending', 'sent', 'failed'],
      default: 'pending'
    },
    sentAt: {
      type: Date,
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
    }
  },
  quotation: {
    status: {
      type: String,
      enum: ['pending', 'sent', 'failed'],
      default: 'pending'
    },
    sentAt: {
      type: Date,
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
    }
  },
  status: {
    type: String,
    enum: ['pending', 'booked', 'not_booked', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  payment: {
    status: {
      type: String,
      enum: ['pending', 'requested', 'processing', 'paid', 'failed', 'cancelled', 'refunded'],
      default: 'pending'
    },
    amount: {
      type: Number,
      default: 1000
    },
    currency: {
      type: String,
      default: 'INR'
    },
    provider: {
      type: String,
      default: 'mock'
    },
    transactionId: {
      type: String,
      default: null
    },
    requestedAt: {
      type: Date,
      default: null
    },
    paidAt: {
      type: Date,
      default: null
    },
    failedAt: {
      type: Date,
      default: null
    },
    lastError: {
      type: String,
      default: null
    },
    attempts: {
      type: Number,
      default: 0
    }
  },
  followup: {
    status: {
      type: String,
      enum: ['pending', 'sent', 'failed'],
      default: 'pending'
    },
    sentAt: {
      type: Date,
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
