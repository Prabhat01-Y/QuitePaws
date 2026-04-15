const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Compare against env-stored credentials
  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ message: 'Invalid username or password.' });
  }

  // Sign a JWT token valid for 8 hours
  const token = jwt.sign(
    { username, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.status(200).json({ token, message: 'Login successful' });
});

module.exports = router;
