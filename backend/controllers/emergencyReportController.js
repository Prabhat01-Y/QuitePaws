const EmergencyReport = require('../models/EmergencyReport');

// @desc    Get all emergency reports
// @route   GET /api/emergency-reports
// @access  Public (could be restricted to admin in production)
const getReports = async (req, res) => {
  try {
    const reports = await EmergencyReport.find().sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not fetch reports' });
  }
};

// @desc    Create a new emergency report
// @route   POST /api/emergency-reports
// @access  Public
const createReport = async (req, res) => {
  try {
    const { name, email, mobile, address, description, category, priority, lat, lng } = req.body;

    // Validate required fields
    if (!name || !email || !mobile || !address || !description || !category) {
      return res.status(400).json({ message: 'Please include all required fields' });
    }

    // Create report object
    const reportData = {
      name,
      email,
      mobile,
      address,
      description,
      category,
      priority: priority || 'medium',
      location: (lat && lng) ? { lat: Number(lat), lng: Number(lng) } : undefined
    };

    // Add photo filename if uploaded
    if (req.file) {
      reportData.photo = req.file.filename;
    }

    const report = await EmergencyReport.create(reportData);

    res.status(201).json({
      success: true,
      message: 'Emergency report submitted successfully',
      report
    });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ success: false, message: 'Server Error: Could not create report' });
  }
};

// @desc    Get a single emergency report
// @route   GET /api/emergency-reports/:id
// @access  Public
const getReportById = async (req, res) => {
  try {
    const report = await EmergencyReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not fetch report' });
  }
};

// @desc    Update a report (for admins to update status)
// @route   PUT /api/emergency-reports/:id
// @access  Public (could be restricted to admin in production)
const updateReport = async (req, res) => {
  try {
    const { status, priority } = req.body;

    const report = await EmergencyReport.findByIdAndUpdate(
      req.params.id,
      { status, priority },
      { new: true, runValidators: true }
    );

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Report updated successfully',
      report
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not update report' });
  }
};

// @desc    Delete a report
// @route   DELETE /api/emergency-reports/:id
// @access  Public (could be restricted to admin in production)
const deleteReport = async (req, res) => {
  try {
    const report = await EmergencyReport.findByIdAndDelete(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not delete report' });
  }
};

// @desc    Get available rescues for volunteers
// @route   GET /api/emergency-reports/volunteer/available
// @access  Private (Volunteer/Admin)
const getAvailableRescues = async (req, res) => {
  try {
    // Return pending items (not yet claimed), 
    // OR items already claimed by THIS volunteer that are still IN-PROGRESS
    const rescues = await EmergencyReport.find({
      $or: [
        { status: 'pending' },
        { assignedVolunteer: req.user._id, status: 'in-progress' }
      ]
    }).sort({ priority: 1, createdAt: -1 });

    res.status(200).json(rescues);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not fetch volunteer rescues' });
  }
};

// @desc    Claim a rescue (Volunteer)
// @route   PUT /api/emergency-reports/:id/claim
// @access  Private (Volunteer)
const claimRescue = async (req, res) => {
  try {
    const report = await EmergencyReport.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    
    if (report.status !== 'pending' && report.assignedVolunteer?.toString() !== req.user._id.toString()) {
      return res.status(400).json({ message: 'Rescue is already claimed by someone else' });
    }

    report.status = 'in-progress';
    report.assignedVolunteer = req.user._id;
    const updated = await report.save();

    res.status(200).json({ success: true, report: updated });
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not claim rescue' });
  }
};

// @desc    Complete a rescue (Volunteer marks as done)
// @route   PUT /api/emergency-reports/:id/complete
// @access  Private (Volunteer)
const completeRescue = async (req, res) => {
  try {
    const report = await EmergencyReport.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    // Only the assigned volunteer can complete it
    if (!report.assignedVolunteer || report.assignedVolunteer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to complete this rescue' });
    }

    report.status = 'resolved';
    report.completionNote = req.body.note || '';

    // Attach uploaded photo filenames
    if (req.files && req.files.length > 0) {
      report.completionPhotos = req.files.map(f => f.filename);
    }

    const updated = await report.save();
    res.status(200).json({ success: true, report: updated });
  } catch (error) {
    console.error('Error completing rescue:', error);
    res.status(500).json({ message: 'Server Error: Could not complete rescue' });
  }
};

module.exports = {
  getReports,
  createReport,
  getReportById,
  updateReport,
  deleteReport,
  getAvailableRescues,
  claimRescue,
  completeRescue
};
