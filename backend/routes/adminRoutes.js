const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  getMetrics,
  getAdoptions,
  updateAdoptionStatus,
  getRescues,
  updateRescueStatus,
  getVolunteers,
  getDonations
} = require('../controllers/adminController');

// All routes here are protected and adminOnly
router.use(protect, adminOnly);

// Metrics
router.get('/metrics', getMetrics);

// Adoptions
router.get('/adoptions', getAdoptions);
router.put('/adoptions/:id', updateAdoptionStatus);

// Rescues
router.get('/rescues', getRescues);
router.put('/rescues/:id', updateRescueStatus);

// Volunteers
router.get('/volunteers', getVolunteers);

// Donations
router.get('/donations', getDonations);

module.exports = router;
