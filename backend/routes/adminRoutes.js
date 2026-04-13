const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { 
  getPendingOrganizers, 
  approveOrganizer, 
  rejectOrganizer, 
  getAllOrganizers,
  getDashboardStats,
  getAdmins,
  createAdmin,
  updateAdminStatus,
  deleteAdmin
} = require('../controllers/adminController');

// All routes require admin authentication
router.use(protect, authorize('admin'));

// Dashboard stats
router.get('/stats', getDashboardStats);

// Organizer management
router.get('/pending-organizers', getPendingOrganizers);
router.get('/organizers', getAllOrganizers);
router.put('/approve/:userId', approveOrganizer);
router.put('/reject/:userId', rejectOrganizer);

// Admin management (super admin only)
router.get('/admins', getAdmins);
router.post('/admins', createAdmin);
router.put('/admins/:adminId/status', updateAdminStatus);
router.delete('/admins/:adminId', deleteAdmin);

module.exports = router;
