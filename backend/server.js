// 1. Load environment variables first!
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const fs = require('fs');

// 2. Connect to the database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// 3. Create uploads directory if it doesn't exist
const uploadsPath = path.join(__dirname, 'uploads/emergency-reports');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

// 4. Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded files

// 5. API Routes
app.use('/api/animals', require('./routes/animalRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/donations', require('./routes/donationRoutes'));
app.use('/api/adoptions', require('./routes/adoptionRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// The new dynamic event routes
const eventRoutes = require('./routes/eventRoutes');
app.use('/api/events', eventRoutes);
app.use('/api/volunteer-registrations', require('./routes/volunteerRegistrationRoutes'));

// Emergency Report Routes
app.use('/api/emergency-reports', require('./routes/emergencyReportRoutes'));

// Public Stats Routes
app.use('/api/public', require('./routes/publicRoutes'));

// (Optional) If you have your contact form route set up from your file structure:
// app.use('/api/contact', require('./routes/contactRoutes'));

// 6. Basic test route
app.get('/', (req, res) => {
  res.send('Welcome to the QuietPaws API!');
});

// 7. Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});