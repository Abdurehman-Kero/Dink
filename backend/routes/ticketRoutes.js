const express = require('express');

const { protect } = require('../middleware/authMiddleware');
const { getMyTickets } = require('../controllers/ticketController');

const router = express.Router();

router.get('/my-tickets', protect, getMyTickets);

module.exports = router;
