const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getEventAnalytics, getOrganizerStats } = require('../controllers/analyticsController');

// Get organizer dashboard stats
router.get('/organizer/stats', protect, authorize('organizer'), getOrganizerStats);

// Get event analytics
router.get('/event/:eventId', protect, authorize('organizer'), getEventAnalytics);

module.exports = router;
