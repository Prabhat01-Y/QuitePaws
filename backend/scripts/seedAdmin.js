require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');

const seedAdmin = async () => {
  try {
    await connectDB();

    const email = `${process.env.ADMIN_USERNAME}@quietpaws.org`; 
    const password = process.env.ADMIN_PASSWORD;

    // Check if admin already exists
    const adminExists = await User.findOne({ email });

    if (adminExists) {
      console.log('Admin already seeded in database');
      process.exit();
    }

    const admin = await User.create({
      name: 'System Admin',
      email: email, 
      password: password,
      role: 'admin',
    });

    console.log(`Admin account created with email: ${email}`);
    process.exit();
  } catch (error) {
    console.error(`Error with seeding Admin: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
