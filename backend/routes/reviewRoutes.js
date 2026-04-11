const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { addReview, getEventReviews, addReviewReply } = require('../controllers/reviewController');

router.get('/event/:eventId', getEventReviews);
router.post('/', protect, addReview);
router.post('/reply', protect, addReviewReply);

module.exports = router;
