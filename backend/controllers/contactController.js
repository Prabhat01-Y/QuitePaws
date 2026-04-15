// @desc    Receive and process contact form submissions
// @route   POST /api/contact
// @access  Public
const submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    // If you create a Contact.js model later, you would save it to the DB here.
    // For now, we return a success response to the frontend.
    res.status(200).json({ message: 'Contact message received successfully by the server.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error processing contact form' });
  }
};

module.exports = {
  submitContactForm
};