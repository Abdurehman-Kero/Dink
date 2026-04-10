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
    const { full_name, email, password, phone, user_name } = req.body;
    
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
    
    // Create user (role_id: 3 = attendee)
    await sequelize.query(
      `INSERT INTO users (id, role_id, full_name, email, password_hash, phone, user_name, status) 
       VALUES (REPLACE(UUID(), '-', ''), ?, ?, ?, ?, ?, ?, 'active')`,
      { replacements: [3, full_name, email, hashedPassword, phone || null, user_name || email.split('@')[0]] }
    );
    
    // Get the created user
    const [newUser] = await sequelize.query(
      'SELECT id, full_name, email, role_id FROM users WHERE email = ?',
      { replacements: [email] }
    );
    
    const token = generateToken(newUser[0].id);
    
    res.status(201).json({
      success: true,
      token,
      user: newUser[0]
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
