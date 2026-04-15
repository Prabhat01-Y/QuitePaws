const Animal = require('../models/Animal');

// @desc    Get all animals available for adoption
// @route   GET /api/animals
// @access  Public
const getAnimals = async (req, res) => {
  try {
    const animals = await Animal.find();
    res.status(200).json(animals);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not fetch animals' });
  }
};

// @desc    Create a new animal profile
// @route   POST /api/animals
// @access  Public (Normally you'd protect this so only admins can add animals!)
const createAnimal = async (req, res) => {
  try {
    const { name, breed, adoptionFee, personalityTraits, image } = req.body;

    if (!name || !breed || !adoptionFee || !image) {
      return res.status(400).json({ message: 'Please include all required fields' });
    }

    const animal = await Animal.create({
      name,
      breed,
      adoptionFee,
      personalityTraits,
      image
    });

    res.status(201).json(animal);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not create animal profile' });
  }
};

module.exports = {
  getAnimals,
  createAnimal
};