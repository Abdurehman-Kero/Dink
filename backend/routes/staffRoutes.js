const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { createStaff, getStaffMembers, getStaffDashboard, scanTicket } = require('../controllers/staffController');

// Organizer routes
router.post('/create', protect, authorize('organizer', 'admin'), createStaff);
router.get('/members', protect, authorize('organizer', 'admin'), getStaffMembers);

// Staff routes
router.get('/dashboard', protect, getStaffDashboard);
router.post('/scan', protect, authorize('staff', 'security', 'admin', 'organizer'), scanTicket);

module.exports = router;
