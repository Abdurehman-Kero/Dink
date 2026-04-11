const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'dems-secret-key', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

const register = async (req, res) => {
  try {
    const { 
      full_name, email, password, phone, user_name, role,
      organization_name, organization_type, website_url, bio,
      tax_id_number, business_registration_number,
      social_linkedin, social_instagram, social_x, work_email
    } = req.body;
    
    // Check if user exists
    const [users] = await sequelize.query(
      'SELECT * FROM users WHERE email = ?',
      { replacements: [email] }
    );
    
    if (users.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Determine role and status
    let roleId = 3; // attendee default
    let status = 'active';
    
    if (role === 'organizer') {
      roleId = 2;
      status = 'pending'; // Organizers need admin approval
    } else if (role === 'admin') {
      roleId = 1;
      status = 'active';
    }
    
    // Create user
    await sequelize.query(
      `INSERT INTO users (id, role_id, full_name, email, password_hash, phone, user_name, status, email_verified) 
       VALUES (REPLACE(UUID(), '-', ''), ?, ?, ?, ?, ?, ?, ?, true)`,
      { replacements: [roleId, full_name, email, hashedPassword, phone || null, user_name || email.split('@')[0], status] }
    );
    
    // Get the created user
    const [newUser] = await sequelize.query(
      'SELECT id, full_name, email, role_id, status FROM users WHERE email = ?',
      { replacements: [email] }
    );
    
    const userId = newUser[0].id;
    
    // If organizer, create organizer profile
    if (role === 'organizer') {
      await sequelize.query(`
        INSERT INTO organizer_profiles (
          user_id, organization_name, organization_type, website_url, bio,
          tax_id_number, business_registration_number, social_linkedin, 
          social_instagram, social_x, work_email, verification_status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())
      `, { 
        replacements: [
          userId, organization_name, organization_type, website_url || null, bio,
          tax_id_number || null, business_registration_number || null,
          social_linkedin || null, social_instagram || null, social_x || null,
          work_email || email
        ] 
      });
    }
    
    // For attendees, return token immediately
    if (role !== 'organizer') {
      const token = generateToken(userId);
      return res.status(201).json({
        success: true,
        token,
        user: newUser[0]
      });
    }
    
    // For organizers, don't return token - they need approval
    res.status(201).json({
      success: true,
      message: 'Registration successful! Your application is pending admin approval. You will receive an email once approved.',
      user: newUser[0],
      requiresApproval: true
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const [users] = await sequelize.query(
      'SELECT * FROM users WHERE email = ?',
      { replacements: [email] }
    );
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const user = users[0];
    
    // Check if user is pending approval
    if (user.status === 'pending') {
      return res.status(401).json({ 
        message: 'Your account is pending admin approval. You will receive an email once approved.',
        requiresApproval: true 
      });
    }
    
    if (user.status === 'suspended') {
      return res.status(401).json({ message: 'Your account has been suspended. Please contact support.' });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Update last login
    await sequelize.query(
      'UPDATE users SET last_login_at = NOW() WHERE id = ?',
      { replacements: [user.id] }
    );
    
    // Generate token
    const token = generateToken(user.id);
    
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role_id: user.role_id,
        status: user.status
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login };
