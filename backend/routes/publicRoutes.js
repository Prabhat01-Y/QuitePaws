const express = require('express');
const router = express.Router();
const AdoptionRequest = require('../models/AdoptionRequest');
const EmergencyReport = require('../models/EmergencyReport');
const User = require('../models/User');
const VolunteerRegistration = require('../models/VolunteerRegistration');

// @desc    Get public impact stats for About page
// @route   GET /api/public/stats
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    // 1. Animals Rescued (Total emergency reports)
    const totalRescues = await EmergencyReport.countDocuments();
    
    // 2. Successful Adoptions (Approved requests)
    const totalAdoptions = await AdoptionRequest.countDocuments({ status: 'approved' });
    
    // 3. Active Volunteers (Users with volunteer role + direct registrations)
    const volunteerUsers = await User.countDocuments({ role: 'volunteer' });
    const eventRegistrations = await VolunteerRegistration.countDocuments();
    const totalVolunteers = volunteerUsers + eventRegistrations;

    res.json({
      rescues: totalRescues,
      adoptions: totalAdoptions,
      volunteers: totalVolunteers
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
});

module.exports = router;
