const AdoptionRequest = require('../models/AdoptionRequest');

// @desc    Submit new adoption request
// @route   POST /api/adoptions
// @access  Public
const createAdoptionRequest = async (req, res) => {
  try {
    const requestData = {
      ...req.body,
      // Attached user ID if logged in, but not forcing failure if omitted since old flow is public
      user: req.user ? req.user._id : undefined 
    };

    const adoption = await AdoptionRequest.create(requestData);
    res.status(201).json(adoption);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create adoption request', error: error.message });
  }
};

// @desc    Get adoptions tied to specific user
// @route   GET /api/adoptions/my-requests
// @access  Private
const getMyAdoptions = async (req, res) => {
  try {
    const adoptions = await AdoptionRequest.find({ user: req.user._id }).populate('animal', 'name breed image');
    res.json(adoptions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch adoption records' });
  }
};

module.exports = { createAdoptionRequest, getMyAdoptions };
