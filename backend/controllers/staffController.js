const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// Email transporter setup (optional - will work without email)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send staff invitation email
const sendStaffInvitation = async (email, password, fullName, eventName, role, eventDate, eventLocation) => {
  const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`;
  
  const mailOptions = {
    from: `"DEMS Team" <${process.env.EMAIL_FROM || 'noreply@dems.com'}>`,
    to: email,
    subject: `You have been invited as a ${role} for ${eventName} - DEMS`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e3a2f, #2d5a3f); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">DEMS Event Platform</h1>
          <p style="color: #fbbf24; margin: 5px 0 0;">Event Management System</p>
        </div>
        <div style="padding: 30px; background: white;">
          <h2 style="color: #1e3a2f;">Dear ${fullName},</h2>
          <p>You have been invited to join <strong>${eventName}</strong> as a <strong>${role.toUpperCase()}</strong>.</p>
          
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px; color: #1e3a2f;">Event Details:</h3>
            <p><strong>Event:</strong> ${eventName}</p>
            <p><strong>Date:</strong> ${new Date(eventDate).toLocaleDateString()}</p>
            <p><strong>Location:</strong> ${eventLocation}</p>
            <p><strong>Role:</strong> ${role}</p>
          </div>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px; color: #92400e;">Your Login Credentials:</h3>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Password:</strong> ${password}</p>
          </div>
          
          <a href="${loginUrl}" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">
            Click Here to Login
          </a>
          
          <p style="color: #6b7280; font-size: 14px;">Please change your password after first login for security purposes.</p>
          <hr style="margin: 20px 0;" />
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            © ${new Date().getFullYear()} DEMS Event Platform. All rights reserved.<br>
            Addis Ababa, Ethiopia
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Invitation email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Email send failed:', error.message);
    return false;
  }
};

// Create staff member with custom password
const createStaff = async (req, res) => {
  try {
    const { full_name, email, phone_number, assigned_role, event_id, staff_badge_id, password } = req.body;
    const organizerId = req.user.id;
    
    console.log('Creating staff with data:', { full_name, email, assigned_role, event_id, passwordProvided: !!password });
    
    // Validate password
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    
    // Check if user already exists
    const [existingUser] = await sequelize.query(
      'SELECT id FROM users WHERE email = ?',
      { replacements: [email] }
    );
    
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Hash the provided password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Get event details
    const [events] = await sequelize.query(
      'SELECT title, start_datetime, venue_name, city FROM events WHERE id = ?',
      { replacements: [event_id] }
    );
    
    if (events.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    const event = events[0];
    
    // Determine role_id (4 for staff, 5 for security)
    const roleId = assigned_role === 'security' ? 5 : 4;
    
    // Create user account for staff
    await sequelize.query(`
      INSERT INTO users (id, role_id, full_name, email, password_hash, user_name, status, email_verified)
      VALUES (REPLACE(UUID(), '-', ''), ?, ?, ?, ?, ?, 'active', true)
    `, { replacements: [roleId, full_name, email, hashedPassword, email.split('@')[0]] });
    
    // Get the created user
    const [newUser] = await sequelize.query(
      'SELECT id FROM users WHERE email = ?',
      { replacements: [email] }
    );
    
    // Create staff record with event_id
    await sequelize.query(`
      INSERT INTO staff_members (id, organizer_id, event_id, user_id, full_name, email, phone_number, assigned_role, staff_badge_id, status)
      VALUES (REPLACE(UUID(), '-', ''), ?, ?, ?, ?, ?, ?, ?, ?, 'active')
    `, { replacements: [organizerId, event_id, newUser[0].id, full_name, email, phone_number || null, assigned_role, staff_badge_id || null] });
    
    // Send invitation email (don't await - fire and forget)
    sendStaffInvitation(email, password, full_name, event.title, assigned_role, event.start_datetime, `${event.venue_name}, ${event.city}`);
    
    res.status(201).json({ 
      success: true, 
      message: `Staff member created successfully! An email has been sent to ${email} with login credentials.`
    });
  } catch (error) {
    console.error('Create staff error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get staff members for organizer
const getStaffMembers = async (req, res) => {
  try {
    const organizerId = req.user.id;
    
    const [staff] = await sequelize.query(`
      SELECT s.*, e.title as event_name, u.status as user_status
      FROM staff_members s
      LEFT JOIN events e ON s.event_id = e.id
      LEFT JOIN users u ON s.user_id = u.id
      WHERE s.organizer_id = ?
      ORDER BY s.created_at DESC
    `, { replacements: [organizerId] });
    
    res.json({ success: true, staff });
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get staff dashboard (for staff login)
const getStaffDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [staff] = await sequelize.query(`
      SELECT s.*, e.title as event_name, e.id as event_id, 
             e.start_datetime, e.end_datetime, e.venue_name, e.city,
             e.banner_url, e.description
      FROM staff_members s
      JOIN events e ON s.event_id = e.id
      WHERE s.user_id = ?
    `, { replacements: [userId] });
    
    if (staff.length === 0) {
      return res.status(404).json({ message: 'No assigned event found' });
    }
    
    // Get attendance stats for the event
    const [stats] = await sequelize.query(`
      SELECT 
        COUNT(*) as total_tickets,
        SUM(CASE WHEN is_used = true THEN 1 ELSE 0 END) as checked_in
      FROM digital_tickets
      WHERE event_id = ?
    `, { replacements: [staff[0].event_id] });
    
    res.json({ 
      success: true, 
      staff: staff[0],
      stats: stats[0] || { total_tickets: 0, checked_in: 0 }
    });
  } catch (error) {
    console.error('Get staff dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Scan ticket (for security staff)
const scanTicket = async (req, res) => {
  try {
    const { ticket_code } = req.body;
    const userId = req.user.id;
    
    // Get staff info with event_id
    const [staff] = await sequelize.query(
      'SELECT event_id, assigned_role FROM staff_members WHERE user_id = ?',
      { replacements: [userId] }
    );
    
    if (staff.length === 0) {
      return res.status(403).json({ message: 'No event assigned' });
    }
    
    const eventId = staff[0].event_id;
    
    // Find ticket
    const [tickets] = await sequelize.query(
      `SELECT dt.*, tt.tier_name 
       FROM digital_tickets dt
       JOIN ticket_types tt ON dt.ticket_type_id = tt.id
       WHERE dt.ticket_code = ? AND dt.event_id = ?`,
      { replacements: [ticket_code, eventId] }
    );
    
    if (tickets.length === 0) {
      return res.status(404).json({ message: 'Invalid ticket code' });
    }
    
    const ticket = tickets[0];
    
    if (ticket.is_used) {
      return res.status(400).json({ message: 'Ticket already used', status: 'already_scanned' });
    }
    
    // Mark ticket as used
    await sequelize.query(
      'UPDATE digital_tickets SET is_used = true, used_at = NOW() WHERE id = ?',
      { replacements: [ticket.id] }
    );
    
    // Log check-in
    await sequelize.query(`
      INSERT INTO check_in_logs (id, ticket_id, staff_id, event_id, status, check_in_time)
      VALUES (REPLACE(UUID(), '-', ''), ?, ?, ?, 'valid', NOW())
    `, { replacements: [ticket.id, userId, eventId] });
    
    res.json({ 
      success: true, 
      message: 'Ticket validated successfully',
      ticket: {
        tier_name: ticket.tier_name
      }
    });
  } catch (error) {
    console.error('Scan ticket error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createStaff, getStaffMembers, getStaffDashboard, scanTicket };
