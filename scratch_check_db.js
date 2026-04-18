const mongoose = require('mongoose');
const User = require('./backend/models/User');
require('dotenv').config({ path: './backend/.env' });

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const allUsers = await User.find({});
        console.log("TOTAL USERS:", allUsers.length);
        console.log("VOLUNTEERS:", allUsers.filter(u => u.role === 'volunteer').map(u => ({ name: u.name, role: u.role })));
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
