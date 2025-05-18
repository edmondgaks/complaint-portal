const mongoose = require('mongoose');

const AgencySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  categories: [{
    type: String, 
    required: true,
  }],
  contactEmail: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Agency', AgencySchema);
