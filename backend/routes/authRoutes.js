const express = require('express');
const router = express.Router();
const { register, login, sendOTP, verifyOTP } = require('../controllers/authController');
const { validate } = require('../middleware/validationMiddleware');
const { userValidation } = require('../middleware/validationMiddleware');
const { authLimiter } = require('../middleware/rateLimitMiddleware');

// Public routes
router.post('/register', validate(userValidation.register), register);
router.post('/login', authLimiter, validate(userValidation.login), login);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

module.exports = router;
