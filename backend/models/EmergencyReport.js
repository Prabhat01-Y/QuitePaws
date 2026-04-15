const mongoose = require('mongoose');

const emergencyReportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  mobile: {
    type: String,
    required: [true, 'Please provide a mobile number']
  },
  address: {
    type: String,
    required: [true, 'Please provide the incident address']
  },
  description: {
    type: String,
    required: [true, 'Please describe the incident']
  },
  category: {
    type: String,
    enum: ['injured-animal', 'stray-animal', 'animal-abuse', 'lost-pet', 'wildlife-issue', 'other'],
    required: [true, 'Please select an incident category']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  photo: {
    type: String, // Will store filename or path of uploaded photo
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('EmergencyReport', emergencyReportSchema);
