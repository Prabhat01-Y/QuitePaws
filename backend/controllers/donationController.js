const Donation = require('../models/Donation');

// @desc    Process a new donation
// @route   POST /api/donations
// @access  Public
const processDonation = async (req, res) => {
  try {
    const { amount, paymentMethod, donorName, donorEmail } = req.body;

    // Basic validation
    if (!amount || !paymentMethod || !donorName || !donorEmail) {
      return res.status(400).json({ message: 'Name, Email, Amount and Payment Method are required.' });
    }

    // Save to database
    const donation = await Donation.create({
      donorName,
      donorEmail,
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