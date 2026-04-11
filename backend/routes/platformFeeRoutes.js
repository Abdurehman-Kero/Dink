const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  initPlatformFeePayment, 
  verifyPlatformFeePayment, 
  getPlatformFeeHistory 
} = require('../controllers/platformFeeController');

// Public route for Chapa callback
router.post('/chapa/callback', verifyPlatformFeePayment);

// Protected routes
router.post('/init', protect, initPlatformFeePayment);
router.get('/history', protect, getPlatformFeeHistory);

module.exports = router;
