const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: [
      'roads',
      'water',
      'electricity',
      'waste',
      'public_safety',
      'environment',
      'public_property',
      'others'
    ]
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters']
  },
  location: {
      type: String,
      required: [true, 'Please provide an address']
  },
  media: [{
    type: String, // URL to the uploaded file
    trim: true
  }],
  status: {
    type: String,
    enum: ['Submitted', 'In Progress', 'Resolved', 'Rejected'],
    default: 'Submitted'
  },
  assignedAgency: {
    type: String,
    trim: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  votes: {
    type: Number,
    default: 0
  },
  responses: [{
    respondent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: {
      type: String,
      trim: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Generate a unique ticket ID before saving
complaintSchema.pre('save', async function(next) {
  if (!this.isNew) {
    return next();
  }
  
  const count = await mongoose.model('Complaint').countDocuments();
  const prefix = 'CMP';
  const date = new Date();
  const year = date.getFullYear().toString().substr(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  
  this.ticketId = `${prefix}${year}${month}${(count + 1).toString().padStart(5, '0')}`;
  next();
});

// Index for faster queries (removed duplicate ticketId index)
complaintSchema.index({ status: 1, category: 1, createdAt: -1 });
complaintSchema.index({ user: 1 });

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;