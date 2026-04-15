const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add an animal name']
  },
  breed: {
    type: String,
    required: [true, 'Please add a breed']
  },
  adoptionFee: {
    type: Number,
    required: [true, 'Please add an adoption fee']
  },
  personalityTraits: {
    type: [String], // Array of strings to match your bullet points
    required: true
  },
  image: {
    type: String, // This will store the image filename (like 'd1.png')
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Animal', animalSchema);