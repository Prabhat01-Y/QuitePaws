const express = require('express');
const router = express.Router();
const { processDonation } = require('../controllers/donationController');

router.route('/').post(processDonation);

module.exports = router;