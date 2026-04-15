const mongoose = require('mongoose');

const volunteerRegistrationSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    eventId: { type: String, required: true }, // This will store the slug like "beach-cleanup"
    notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('VolunteerRegistration', volunteerRegistrationSchema);