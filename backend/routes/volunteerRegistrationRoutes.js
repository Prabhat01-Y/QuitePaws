const express = require('express');
const router = express.Router();
const { registerVolunteer, getRegistrations } = require('../controllers/volunteerRegistrationController');

router.post('/', registerVolunteer);
router.get('/', getRegistrations);

module.exports = router;