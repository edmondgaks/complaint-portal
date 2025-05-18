const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a category name'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  agencyResponsible: {
    type: String,
    required: [true, 'Please specify the responsible agency'],
    trim: true
  },
  contactEmail: {
    type: String,
    trim: true
  },
  contactPhone: {
    type: String,
    trim: true
  },
  subcategories: [{
    type: String,
    trim: true
  }],
  serviceLevel: {
    responseTime: {
      type: Number, // hours
      default: 48
    },
    resolutionTime: {
      type: Number, // hours
      default: 120
    }
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;