const express = require('express');
const router = express.Router();
const { createAdoptionRequest, getMyAdoptions } = require('../controllers/adoptionController');
const { protect } = require('../middleware/authMiddleware');

// Note: wrapped in protect so we can grab req.user, but we'll make it optional in the controller
// Actually, standard protect middleware rejects if no token is found.
// Our adoption process is currently public. Let's make a custom optional auth middleware or bypass it here.
// For now, let's keep it public so old forms still work.

router.post('/', createAdoptionRequest);
router.get('/my-requests', protect, getMyAdoptions);

module.exports = router;
