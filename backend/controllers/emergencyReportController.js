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
    const { name, email, mobile, address, description, category, priority } = req.body;

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
      priority: priority || 'medium'
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

module.exports = {
  getReports,
  createReport,
  getReportById,
  updateReport,
  deleteReport
};
