const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getAdmins, createAdmin, updateAdminStatus, deleteAdmin } = require('../controllers/adminController');

// All routes require authentication and admin role
router.use(protect, authorize('admin'));

router.get('/admins', getAdmins);
router.post('/admins', createAdmin);
router.put('/admins/status', updateAdminStatus);
router.delete('/admins/:adminId', deleteAdmin);

module.exports = router;
