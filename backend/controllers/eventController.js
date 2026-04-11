const { sequelize } = require('../config/database');

// Get all events (public)
const getEvents = async (req, res) => {
  try {
    const [events] = await sequelize.query(`
      SELECT e.*, ec.name as category_name 
      FROM events e
      LEFT JOIN event_categories ec ON e.category_id = ec.id
      WHERE e.status = 'published'
      ORDER BY e.start_datetime ASC
    `);
    res.json({ success: true, events });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get events by organizer (for organizer dashboard)
const getEventsByOrganizer = async (req, res) => {
  try {
    const organizerId = req.user.id;
    console.log('=== getEventsByOrganizer called ===');
    console.log('Organizer ID from token:', organizerId);
    
    const [events] = await sequelize.query(`
      SELECT e.*, ec.name as category_name 
      FROM events e
      LEFT JOIN event_categories ec ON e.category_id = ec.id
      WHERE e.organizer_id = ?
      ORDER BY e.created_at DESC
    `, { replacements: [organizerId] });
    
    console.log(`Found ${events.length} events for organizer ${organizerId}`);
    res.json({ success: true, events });
  } catch (error) {
    console.error('Get events by organizer error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single event
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
    
    const [tickets] = await sequelize.query(
      'SELECT * FROM ticket_types WHERE event_id = ? AND is_active = true',
      { replacements: [req.params.id] }
    );
    
    res.json({ success: true, event: events[0], ticket_types: tickets });
  } catch (error) {
    console.error('Get event by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create event
const createEvent = async (req, res) => {
  try {
    const { 
      title, category_id, event_type, description, 
      start_datetime, end_datetime, city, venue_name, 
      address_line1, banner_url, ticket_types 
    } = req.body;
    
    const organizerId = req.user.id;
    console.log('Creating event for organizer:', organizerId);
    console.log('Banner URL:', banner_url);
    
    // Insert event
    await sequelize.query(`
      INSERT INTO events (
        id, organizer_id, title, category_id, event_type, 
        description, start_datetime, end_datetime, city, 
        venue_name, address_line1, banner_url, status, created_at
      ) VALUES (
        REPLACE(UUID(), '-', ''), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', NOW()
      )
    `, { 
      replacements: [
        organizerId, title, category_id, event_type, 
        description, start_datetime, end_datetime, city, 
        venue_name, address_line1, banner_url || null
      ] 
    });
    
    // Get the created event ID
    const [newEvent] = await sequelize.query(
      'SELECT id FROM events WHERE organizer_id = ? ORDER BY created_at DESC LIMIT 1',
      { replacements: [organizerId] }
    );
    
    const eventId = newEvent[0]?.id;
    console.log('Event created with ID:', eventId);
    
    // Insert ticket types if provided
    if (ticket_types && ticket_types.length > 0) {
      for (const ticket of ticket_types) {
        if (ticket.price && ticket.capacity) {
          await sequelize.query(`
            INSERT INTO ticket_types (
              id, event_id, tier_name, price, currency, 
              capacity, remaining_quantity, benefits, is_active
            ) VALUES (
              REPLACE(UUID(), '-', ''), ?, ?, ?, 'ETB', ?, ?, ?, true
            )
          `, { 
            replacements: [
              eventId, ticket.tier_name, ticket.price, 
              ticket.capacity, ticket.remaining_quantity || ticket.capacity, 
              ticket.benefits || ''
            ] 
          });
        }
      }
    }
    
    res.status(201).json({ success: true, event_id: eventId });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update event
const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    
    const [events] = await sequelize.query(
      'SELECT * FROM events WHERE id = ?',
      { replacements: [eventId] }
    );
    
    if (events.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    const event = events[0];
    
    if (event.organizer_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const { title, description, start_datetime, end_datetime, city, venue_name, address_line1, banner_url } = req.body;
    
    await sequelize.query(`
      UPDATE events 
      SET title = ?, description = ?, start_datetime = ?, end_datetime = ?, 
          city = ?, venue_name = ?, address_line1 = ?, banner_url = ?, updated_at = NOW()
      WHERE id = ?
    `, { replacements: [title, description, start_datetime, end_datetime, city, venue_name, address_line1, banner_url, eventId] });
    
    res.json({ success: true, message: 'Event updated successfully' });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete event
const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    
    const [events] = await sequelize.query(
      'SELECT * FROM events WHERE id = ?',
      { replacements: [eventId] }
    );
    
    if (events.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    const event = events[0];
    
    if (event.organizer_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await sequelize.query('DELETE FROM events WHERE id = ?', { replacements: [eventId] });
    
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get featured events
const getFeaturedEvents = async (req, res) => {
  try {
    const [events] = await sequelize.query(`
      SELECT e.*, ec.name as category_name 
      FROM events e
      LEFT JOIN event_categories ec ON e.category_id = ec.id
      WHERE e.is_featured = true AND e.status = 'published'
      LIMIT 6
    `);
    res.json({ success: true, events });
  } catch (error) {
    console.error('Get featured events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getEvents,
  getEventsByOrganizer,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getFeaturedEvents
};
