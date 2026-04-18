const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    slug: { type: String, required: true, unique: true }, // e.g., "beach-cleanup"
    title: { type: String, required: true },
    date: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    organizer: { type: String, required: true },
    contact: { type: String, required: true },
    slots: { type: Number, default: 0 },
    registeredVolunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);