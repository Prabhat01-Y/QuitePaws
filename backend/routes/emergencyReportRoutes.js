const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const {
  getReports,
  createReport,
  getReportById,
  updateReport,
  deleteReport,
  getAvailableRescues,
  claimRescue,
  completeRescue
} = require('../controllers/emergencyReportController');
const { protect } = require('../middleware/authMiddleware');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/emergency-reports/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Allow only image files
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Volunteer Routes
router.get('/volunteer/available', protect, getAvailableRescues);
router.put('/:id/claim', protect, claimRescue);
router.put('/:id/complete', protect, upload.array('photos', 5), completeRescue);

// Public/Admin Routes
router.get('/', getReports);
router.post('/', upload.single('photo'), createReport);
router.get('/:id', getReportById);
router.put('/:id', updateReport);
router.delete('/:id', deleteReport);

module.exports = router;
