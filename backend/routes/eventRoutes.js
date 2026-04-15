const express = require('express');
const router = express.Router(); 

const { getEventBySlug, createEvent, getAllEvents } = require('../controllers/eventController');

router.get('/', getAllEvents); // <-- This is the new route we need
router.get('/:slug', getEventBySlug);
router.post('/', createEvent);

module.exports = router;