const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  initPayment, 
  chapaCallback, 
  verifyPaymentStatus,
  paymentSuccess
} = require('../controllers/paymentController');

// Public routes (webhooks and callbacks)
router.post('/chapa/callback', chapaCallback);
router.get('/verify', verifyPaymentStatus);
router.get('/success-page', paymentSuccess);

// Protected routes
router.post('/init', protect, initPayment);

module.exports = router;
