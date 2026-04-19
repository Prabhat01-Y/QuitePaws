const express = require('express');
const router = express.Router();
const { 
  getAnimals, 
  createAnimal, 
  getAnimalById, 
  updateAnimal, 
  deleteAnimal 
} = require('../controllers/animalController');

const upload = require('../middleware/uploadAnimal');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public: get all animals
router.get('/', getAnimals);

// Public: get a single animal by ID
router.get('/:id', getAnimalById);

// Protected: create animal (admin only)
router.post('/', protect, adminOnly, createAnimal);

// Protected: update animal (admin only)
router.put('/:id', protect, adminOnly, updateAnimal);

// Protected: delete animal (admin only)
router.delete('/:id', protect, adminOnly, deleteAnimal);

// Protected: upload animal image (admin only)
router.post('/upload-image', protect, adminOnly, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file uploaded' });
  }
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/animals/${req.file.filename}`;
  res.status(200).json({ imageUrl });
});

module.exports = router;