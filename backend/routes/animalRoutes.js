const express = require('express');
const router = express.Router();
const { getAnimals, createAnimal } = require('../controllers/animalController');
const upload = require('../middleware/uploadAnimal');
const protect = require('../middleware/authMiddleware');

// Public: get all animals
router.get('/', getAnimals);

// Protected: create animal (admin only)
router.post('/', protect, createAnimal);

// Protected: upload animal image (admin only)
router.post('/upload-image', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file uploaded' });
  }
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/animals/${req.file.filename}`;
  res.status(200).json({ imageUrl });
});

module.exports = router;