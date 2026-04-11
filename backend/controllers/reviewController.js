const { sequelize } = require('../config/database');

// Add a review for an event (testing mode - skip purchase check)
const addReview = async (req, res) => {
  try {
    const { event_id, rating, review_text } = req.body;
    const user_id = req.user.id;
    
    // TEMPORARY: Skip purchase check for testing
    // In production, uncomment the purchase check below
    
    // Check if already reviewed
    const [existing] = await sequelize.query(
      'SELECT id FROM reviews WHERE user_id = ? AND event_id = ?',
      { replacements: [user_id, event_id] }
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ message: 'You have already reviewed this event' });
    }
    
    // Add review
    await sequelize.query(`
      INSERT INTO reviews (id, user_id, event_id, rating, review_text, status, created_at)
      VALUES (REPLACE(UUID(), '-', ''), ?, ?, ?, ?, 'visible', NOW())
    `, { replacements: [user_id, event_id, rating, review_text] });
    
    // Update event average rating
    await sequelize.query(`
      UPDATE events e
      SET e.avg_rating = (
        SELECT AVG(rating) FROM reviews WHERE event_id = ? AND status = 'visible'
      )
      WHERE e.id = ?
    `, { replacements: [event_id, event_id] });
    
    res.status(201).json({ success: true, message: 'Review added successfully' });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get reviews for an event
const getEventReviews = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const [reviews] = await sequelize.query(`
      SELECT r.*, u.full_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.event_id = ? AND r.status = 'visible'
      ORDER BY r.created_at DESC
    `, { replacements: [eventId] });
    
    const [avgRating] = await sequelize.query(`
      SELECT COALESCE(AVG(rating), 0) as average, COUNT(*) as total
      FROM reviews
      WHERE event_id = ? AND status = 'visible'
    `, { replacements: [eventId] });
    
    res.json({ 
      success: true, 
      reviews,
      stats: {
        average: parseFloat(avgRating[0]?.average) || 0,
        total: avgRating[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Organizer response to review
const addReviewReply = async (req, res) => {
  try {
    const { review_id, reply_text } = req.body;
    const organizer_id = req.user.id;
    
    // Check if user is the event organizer
    const [review] = await sequelize.query(`
      SELECT e.organizer_id FROM reviews r
      JOIN events e ON r.event_id = e.id
      WHERE r.id = ?
    `, { replacements: [review_id] });
    
    if (review.length === 0 || review[0].organizer_id !== organizer_id) {
      return res.status(403).json({ message: 'Only the event organizer can reply to reviews' });
    }
    
    await sequelize.query(`
      INSERT INTO review_replies (id, review_id, organizer_id, reply_text, created_at)
      VALUES (REPLACE(UUID(), '-', ''), ?, ?, ?, NOW())
    `, { replacements: [review_id, organizer_id, reply_text] });
    
    res.json({ success: true, message: 'Reply added successfully' });
  } catch (error) {
    console.error('Add reply error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addReview, getEventReviews, addReviewReply };
