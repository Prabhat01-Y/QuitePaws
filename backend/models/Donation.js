const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Please provide a donation amount']
  },
  paymentMethod: {
    type: String,
    required: [true, 'Please select a payment method'],
    enum: ['UPI', 'Bank Transfer', 'QR Code'] // Ensures only these options are saved
  },
  status: {
    type: String,
    default: 'Completed'
  }
}, {
  timestamps: true // Automatically records exactly when the donation was made
});

module.exports = mongoose.model('Donation', donationSchema);