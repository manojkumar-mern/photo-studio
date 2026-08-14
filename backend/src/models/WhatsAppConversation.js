import mongoose from 'mongoose';

const whatsappConversationSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    trim: true
  },
  currentStep: {
    type: String,
    required: true,
    default: 'WELCOME',
    trim: true
  },
  service: {
    type: String,
    trim: true
  },
  package: {
    type: String,
    trim: true
  },
  eventDate: {
    type: Date
  },
  location: {
    type: String,
    trim: true
  },
  customerName: {
    type: String,
    trim: true
  },
  requirements: {
    type: String,
    trim: true
  },
  isEditing: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    required: true,
    default: 'active',
    enum: ['active', 'completed', 'human_support']
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure indexes are set
whatsappConversationSchema.index({ lastMessageAt: -1 });

const WhatsAppConversation = mongoose.model('WhatsAppConversation', whatsappConversationSchema);

export default WhatsAppConversation;
