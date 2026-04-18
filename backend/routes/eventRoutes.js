const express = require('express');
const router = express.Router(); 

const { getEventBySlug, createEvent, getAllEvents, deleteEvent, registerForEvent } = require('../controllers/eventController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getAllEvents);
router.get('/:slug', getEventBySlug);
router.post('/', protect, adminOnly, createEvent);
router.delete('/:id', protect, adminOnly, deleteEvent);
router.post('/:id/register', protect, registerForEvent);

module.exports = router;