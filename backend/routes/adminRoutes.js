const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { 
  getPendingOrganizers, 
  approveOrganizer, 
  rejectOrganizer, 
  getAllOrganizers,
  getDashboardStats
} = require('../controllers/adminController');

// All routes require admin authentication
router.use(protect, authorize('admin'));

router.get('/pending-organizers', getPendingOrganizers);
router.get('/organizers', getAllOrganizers);
router.get('/stats', getDashboardStats);
router.put('/approve/:userId', approveOrganizer);
router.put('/reject/:userId', rejectOrganizer);

module.exports = router;
