const { sequelize } = require('../config/database');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, city, search } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT e.*, ec.name as category_name 
      FROM events e
      LEFT JOIN event_categories ec ON e.category_id = ec.id
      WHERE e.status = 'published'
    `;
    const replacements = [];
    
    if (category) {
      query += ` AND e.category_id = ?`;
      replacements.push(category);
    }
    if (city) {
      query += ` AND e.city = ?`;
      replacements.push(city);
    }
    if (search) {
      query += ` AND (e.title LIKE ? OR e.description LIKE ?)`;
      replacements.push(`%${search}%`, `%${search}%`);
    }
    
    query += ` ORDER BY e.start_datetime ASC LIMIT ? OFFSET ?`;
    replacements.push(parseInt(limit), parseInt(offset));
    
    const [events] = await sequelize.query(query, { replacements });
    
    // Get total count
    let countQuery = `SELECT COUNT(*) as total FROM events e WHERE e.status = 'published'`;
    const [countResult] = await sequelize.query(countQuery);
    
    res.json({
      success: true,
      total: countResult[0]?.total || 0,
      page: parseInt(page),
      totalPages: Math.ceil((countResult[0]?.total || 0) / limit),
      events
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const [events] = await sequelize.query(
      `SELECT e.*, ec.name as category_name 
       FROM events e
       LEFT JOIN event_categories ec ON e.category_id = ec.id
       WHERE e.id = ?`,
      { replacements: [req.params.id] }
    );
    
    if (events.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Get ticket types
    const [tickets] = await sequelize.query(
      'SELECT * FROM ticket_types WHERE event_id = ? AND is_active = true',
      { replacements: [req.params.id] }
    );
    
    res.json({ 
      success: true, 
      event: events[0],
      ticket_types: tickets
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create event
// @route   POST /api/events
// @access  Private
const createEvent = async (req, res) => {
  try {
    const eventData = req.body;
    
    const [result] = await sequelize.query(
      `INSERT INTO events (id, organizer_id, title, category_id, event_type, description, 
        start_datetime, end_datetime, city, venue_name, address_line1, status)
       VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft')`,
      { replacements: [
        req.user?.id || 'test-user-id',
        eventData.title,
        eventData.category_id,
        eventData.event_type || 'conference',
        eventData.description,
        eventData.start_datetime,
        eventData.end_datetime,
        eventData.city,
        eventData.venue_name,
        eventData.address_line1
      ]}
    );
    
    res.status(201).json({ success: true, message: 'Event created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    
    // Check if event exists
    const [events] = await sequelize.query(
      'SELECT * FROM events WHERE id = ?',
      { replacements: [eventId] }
    );
    
    if (events.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    const event = events[0];
    
    // Check ownership
    if (event.organizer_id !== req.user?.id) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }
    
    const updates = req.body;
    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), eventId];
    
    await sequelize.query(
      `UPDATE events SET ${setClause}, updated_at = NOW() WHERE id = ?`,
      { replacements: values }
    );
    
    res.json({ success: true, message: 'Event updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    
    // Check if event exists
    const [events] = await sequelize.query(
      'SELECT * FROM events WHERE id = ?',
      { replacements: [eventId] }
    );
    
    if (events.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    const event = events[0];
    
    // Check ownership
    if (event.organizer_id !== req.user?.id) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }
    
    await sequelize.query(
      'DELETE FROM events WHERE id = ?',
      { replacements: [eventId] }
    );
    
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get featured events
// @route   GET /api/events/featured
// @access  Public
const getFeaturedEvents = async (req, res) => {
  try {
    const [events] = await sequelize.query(
      `SELECT e.*, ec.name as category_name 
       FROM events e
       LEFT JOIN event_categories ec ON e.category_id = ec.id
       WHERE e.is_featured = true AND e.status = 'published'
       LIMIT 6`
    );
    
    res.json({ success: true, events });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getFeaturedEvents
};
