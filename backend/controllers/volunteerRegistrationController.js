const VolunteerRegistration = require('../models/VolunteerRegistration');

// POST: Save a new registration
const registerVolunteer = async (req, res) => {
    try {
        const newRegistration = new VolunteerRegistration(req.body);
        const savedRegistration = await newRegistration.save();
        res.status(201).json(savedRegistration);
    } catch (error) {
        console.error("Registration error:", error);
        res.status(400).json({ message: 'Error saving registration', error: error.message });
    }
};

// GET: Fetch all registrations (to show on the front page)
const getRegistrations = async (req, res) => {
    try {
        const registrations = await VolunteerRegistration.find().sort({ createdAt: -1 });
        res.status(200).json(registrations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching registrations' });
    }
};

module.exports = { registerVolunteer, getRegistrations };