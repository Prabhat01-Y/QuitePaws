const mongoose = require('mongoose');
require('dotenv').config();

const Animal = require('./backend/models/Animal');

const checkAnimals = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const animals = await Animal.find({});
        console.log("Animals Data:");
        console.log(JSON.stringify(animals, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkAnimals();
