const jwt = require('jsonwebtoken');
const { sequelize } = require('../config/database');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'dems-secret-key', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
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
    
    // Create user (role_id: 3 = attendee)
    const [result] = await sequelize.query(
      `INSERT INTO users (id, role_id, full_name, email, password_hash, phone, user_name, status) 
       VALUES (UUID(), ?, ?, ?, ?, ?, ?, 'active')`,
      { replacements: [3, full_name, email, password, phone, user_name || email.split('@')[0]] }
    );
    
    // Get the created user
    const [newUser] = await sequelize.query(
      'SELECT id, full_name, email, role_id FROM users WHERE email = ?',
      { replacements: [email] }
    );
    
    // Generate token
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

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
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
    
    // Simple password check (in production, use bcrypt)
    if (password !== user.password_hash && user.password_hash !== password) {
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

// @desc    Send OTP (simplified)
// @route   POST /api/auth/send-otp
// @access  Public
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    console.log(`í³§ OTP for ${email}: ${otp}`);
    
    res.json({ success: true, message: 'OTP sent successfully', otp: otp });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  try {
    const { otp, sentOtp } = req.body;
    
    if (otp === sentOtp) {
      res.json({ success: true, message: 'OTP verified successfully' });
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Verification failed' });
  }
};

module.exports = { register, login, sendOTP, verifyOTP };
