const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { initPayout, getPayoutHistory } = require('../controllers/payoutController');

router.post('/init', protect, initPayout);
router.get('/history', protect, getPayoutHistory);

module.exports = router;
