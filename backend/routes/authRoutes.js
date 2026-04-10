const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { validate } = require('../middleware/validationMiddleware');
const { userValidation } = require('../middleware/validationMiddleware');

// Public routes
router.post('/register', validate(userValidation.register), register);
router.post('/login', validate(userValidation.login), login);

module.exports = router;
