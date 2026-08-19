import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        if (!v) return true; // Optional
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Please provide a valid email address'
    }
  },
  weddingDate: {
    type: Date,
    required: [true, 'Wedding date is required']
  },
  weddingLocation: {
    type: String,
    required: [true, 'Wedding location is required'],
    trim: true
  },
  guestCount: {
    type: Number,
    min: [0, 'Guest count cannot be negative']
  },
  packageInterest: {
    type: String,
    required: [true, 'Package interest is required'],
    enum: {
      values: ['Standard', 'Premium', 'Elite', 'Not Sure'],
      message: 'Package interest must be Standard, Premium, Elite, or Not Sure'
    }
  },
  requirements: {
    type: String,
    trim: true
  },
  source: {
    type: String,
    trim: true
  },
  sourceMedium: {
    type: String,
    trim: true
  },
  sourceCampaign: {
    type: String,
    trim: true
  },
  sourceContent: {
    type: String,
    trim: true
  },
  sourceTerm: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    required: true,
    default: 'new'
  },
  qualification: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Indexes for easy query later
leadSchema.index({ phone: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ weddingDate: 1 });

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;
