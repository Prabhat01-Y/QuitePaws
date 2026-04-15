const Donation = require('../models/Donation');

// @desc    Process a new donation
// @route   POST /api/donations
// @access  Public
const processDonation = async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;

    // Basic validation
    if (!amount || !paymentMethod) {
      return res.status(400).json({ message: 'Amount and Payment Method are required.' });
    }

    // Save to database
    const donation = await Donation.create({
      amount,
      paymentMethod
    });

    res.status(201).json({
      message: 'Donation successful',
      donation
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not process donation' });
  }
};

module.exports = {
  processDonation
};