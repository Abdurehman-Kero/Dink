const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { sequelize } = require('../config/database');

// Get all events (for admin)
router.get('/events', protect, authorize('admin'), async (req, res) => {
  try {
    const [events] = await sequelize.query(`
      SELECT e.*, ec.name as category_name, u.full_name as organizer_name
      FROM events e
      LEFT JOIN event_categories ec ON e.category_id = ec.id
      LEFT JOIN users u ON e.organizer_id = u.id
      ORDER BY e.created_at DESC
    `);
    res.json({ success: true, events });
  } catch (error) {
    console.error('Get all events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete any event (admin)
router.delete('/events/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete ticket types first
    await sequelize.query('DELETE FROM ticket_types WHERE event_id = ?', { replacements: [id] });
    // Delete event
    await sequelize.query('DELETE FROM events WHERE id = ?', { replacements: [id] });
    
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
