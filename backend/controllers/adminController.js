const AdoptionRequest = require('../models/AdoptionRequest');
const Animal = require('../models/Animal');
const EmergencyReport = require('../models/EmergencyReport');
const VolunteerRegistration = require('../models/VolunteerRegistration');
const User = require('../models/User');
const Donation = require('../models/Donation');

// @desc    Get dashboard metrics
// @route   GET /api/admin/metrics
// @access  Private/Admin
const getMetrics = async (req, res) => {
  try {
    const totalAnimals = await Animal.countDocuments();
    const pendingAdoptions = await AdoptionRequest.countDocuments({ status: 'pending' });
    const activeRescues = await EmergencyReport.countDocuments({ status: { $in: ['pending', 'in-progress'] } });
    
    // Sum official volunteer roles + direct registrations
    const volunteerUsers = await User.countDocuments({ role: 'volunteer' });
    const eventRegistrations = await VolunteerRegistration.countDocuments();
    const totalVolunteers = volunteerUsers + eventRegistrations;

    // All registered accounts (Admins, Volunteers, Users)
    const totalUsers = await User.countDocuments();

    res.json({
      totalAnimals,
      pendingAdoptions,
      activeRescues,
      totalVolunteers,
      totalUsers
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching metrics', error: error.message });
  }
};

// @desc    Get all adoption requests
// @route   GET /api/admin/adoptions
// @access  Private/Admin
const getAdoptions = async (req, res) => {
  try {
    const adoptions = await AdoptionRequest.find().populate('animal', 'name breed image');
    res.json(adoptions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching adoptions' });
  }
};

const sendEmail = require('../utils/sendEmail');

// @desc    Update adoption status
// @route   PUT /api/admin/adoptions/:id
// @access  Private/Admin
const updateAdoptionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const adoption = await AdoptionRequest.findById(req.params.id).populate('user', 'name email');

    if (!adoption) return res.status(404).json({ message: 'Adoption request not found' });

    adoption.status = status;
    const updatedAdoption = await adoption.save();

    // Optionally mark animal as unavailable if approved
    if (status === 'approved') {
      await Animal.findByIdAndUpdate(adoption.animal, { isAvailable: false });

      // Send automated email using the direct 'email' field or fallback
      const targetEmail = adoption.email || adoption.user?.email;
      
      if (targetEmail) {
        await sendEmail({
          email: targetEmail,
          subject: '🎉 Your QuietPaws Adoption Request is Approved!',
          message: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
              <h2 style="color: #aa3bff; text-align: center;">Congratulations, ${adoption.name}!</h2>
              <p>Great news! Your recent adoption application has been <strong>approved</strong>.</p>
              <p>Our team is thrilled to welcome you to the QuietPaws family. We will be reaching out via phone shortly to coordinate the pickup/delivery.</p>
              <br/>
              <p>With love,<br/><strong>The QuietPaws Team 🐾</strong></p>
            </div>
          `
        });
      }
    }

    res.json(updatedAdoption);
  } catch (error) {
    res.status(500).json({ message: 'Error updating adoption status' });
  }
};

// @desc    Get all emergency reports
// @route   GET /api/admin/rescues
// @access  Private/Admin
const getRescues = async (req, res) => {
  try {
    const rescues = await EmergencyReport.find().populate('assignedVolunteer', 'name email mobile').sort({ createdAt: -1 });
    res.json(rescues);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rescues' });
  }
};

// @desc    Update emergency report status
// @route   PUT /api/admin/rescues/:id
// @access  Private/Admin
const updateRescueStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const rescue = await EmergencyReport.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(rescue);
  } catch (error) {
    res.status(500).json({ message: 'Error updating rescue status' });
  }
};

// @desc    Get all volunteers
// @route   GET /api/admin/volunteers
// @access  Private/Admin
const getVolunteers = async (req, res) => {
  try {
    // 1. Fetch users with either 'volunteer' or 'admin' roles (since admins can also rescue)
    const users = await User.find({ role: { $in: ['volunteer', 'admin'] } }).select('-password');
    
    // 2. Fetch people who signed up for events via the registration form
    const registrations = await VolunteerRegistration.find();
    
    // 3. Merge them into a consistent format for the dashboard
    const allVolunteers = [
      ...users.map(u => ({
        _id: u._id,
        name: u.name || u.email?.split('@')[0] || 'User',
        email: u.email,
        mobile: u.mobile || (u.role === 'admin' ? 'Admin Access' : 'Has Account'),
        experience: (u.skills && u.skills.length > 0) ? u.skills.join(', ') : (u.role === 'admin' ? 'Platform Management' : 'Registered Volunteer'),
        rolePref: u.availability || 'Flexible',
        createdAt: u.createdAt,
        type: u.role === 'admin' ? 'Admin' : 'Volunteer'
      })),
      ...registrations.map(r => ({
        _id: r._id,
        name: r.fullName || r.name || r.email?.split('@')[0] || 'Applicant',
        email: r.email,
        mobile: r.phone || r.mobile || 'Contact Hidden',
        experience: r.notes || r.eventId || 'Event Interest',
        rolePref: r.eventId || 'General',
        createdAt: r.createdAt,
        type: 'Applicant'
      }))
    ];

    // Sort by most recent
    allVolunteers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(allVolunteers);
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    res.status(500).json({ message: 'Error fetching volunteers' });
  }
};

// @desc    Get all donations
// @route   GET /api/admin/donations
// @access  Private/Admin
const getDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching donations' });
  }
};

module.exports = {
  getMetrics,
  getAdoptions,
  updateAdoptionStatus,
  getRescues,
  updateRescueStatus,
  getVolunteers,
  getDonations
};
