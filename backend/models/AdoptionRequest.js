const mongoose = require('mongoose');

const adoptionSchema = new mongoose.Schema({
  animal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Animal',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // We will allow unauthenticated users to adopt for now to prevent breaking existing flows, but ideally it should require auth
  },
  name: { type: String, required: true },
  aadhaar: { type: String, required: true },
  mobile: { type: String, required: true },
  location: { type: String, required: true },
  adoptionDate: { type: Date, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true },
  homeType: { type: String, required: true }, // Apartment, Independent House, etc.
  rentOrOwn: { type: String, required: true }, // Rent or Own
  hasChildren: { type: String, required: true },
  petsCount: { type: String, required: true }, // "0", "1 Cat", etc
  hoursAlone: { type: String, required: true },
  hasYard: { type: String, required: true },
  intent: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('AdoptionRequest', adoptionSchema);
