const { sequelize } = require('../config/database');
const { initializePayment } = require('../services/chapaService');
const crypto = require('crypto');

// Helper to validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const initPlatformFeePayment = async (req, res) => {
  try {
    const { amount, payment_method } = req.body;
    const userId = req.user.id;
    
    console.log('Platform fee payment request:', { amount, payment_method, userId });
    
    // Validate amount
    if (!amount || amount < 500) {
      return res.status(400).json({ 
        success: false, 
        message: 'Minimum payment amount is ETB 500' 
      });
    }
    
    // Get user details
    const [users] = await sequelize.query(
      'SELECT email, full_name FROM users WHERE id = ?',
      { replacements: [userId] }
    );
    
    if (users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    const user = users[0];
    
    // Validate email format
    if (!isValidEmail(user.email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email format. Please update your profile with a valid email address.' 
      });
    }
    
    const tx_ref = `PLATFORM-${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
    
    // Create table if not exists
    try {
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS platform_fee_payments (
          id VARCHAR(36) PRIMARY KEY,
          user_id VARCHAR(36) NOT NULL,
          amount DECIMAL(10,2) NOT NULL,
          payment_method VARCHAR(50),
          status VARCHAR(50) DEFAULT 'pending',
          tx_ref VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          completed_at DATETIME,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);
    } catch (err) {
      console.log('Table creation skipped:', err.message);
    }
    
    await sequelize.query(
      `INSERT INTO platform_fee_payments (id, user_id, amount, payment_method, status, tx_ref, created_at)
       VALUES (REPLACE(UUID(), '-', ''), ?, ?, ?, 'pending', ?, NOW())`,
      { replacements: [userId, amount, payment_method || 'telebirr', tx_ref] }
    );
    
    const nameParts = (user.full_name || 'Organizer User').split(' ');
    const first_name = nameParts[0];
    const last_name = nameParts.slice(1).join(' ') || 'User';
    
    // Ensure phone number is valid Ethiopian format
    const phoneNumber = '0912345678';
    
    console.log('Initializing Chapa payment with:', {
      amount,
      email: user.email,
      first_name,
      last_name,
      tx_ref
    });
    
    const paymentResult = await initializePayment({
      amount: amount,
      email: user.email,
      first_name: first_name,
      last_name: last_name,
      phone_number: phoneNumber,
      tx_ref: tx_ref,
      title: 'DEMS Platform Fee',
      description: `Platform fee payment of ETB ${amount}`
    });
    
    if (paymentResult.success && paymentResult.checkout_url) {
      console.log('Redirecting to Chapa:', paymentResult.checkout_url);
      return res.json({
        success: true,
        checkout_url: paymentResult.checkout_url,
        tx_ref: tx_ref
      });
    } else {
      console.error('Chapa payment initialization failed:', paymentResult.message);
      return res.status(400).json({
        success: false,
        message: paymentResult.message || 'Payment initialization failed. Please try again.'
      });
    }
  } catch (error) {
    console.error('Init platform fee error:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Internal server error' 
    });
  }
};

const verifyPlatformFeePayment = async (req, res) => {
  try {
    const { tx_ref, status } = req.body;
    console.log('Platform fee callback:', { tx_ref, status });
    
    if (status === 'success') {
      await sequelize.query(
        `UPDATE platform_fee_payments SET status = 'completed', completed_at = NOW() WHERE tx_ref = ?`,
        { replacements: [tx_ref] }
      );
    }
    
    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Platform fee callback error:', error);
    res.status(500).json({ status: 'error' });
  }
};

const getPlatformFeeHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [payments] = await sequelize.query(
      `SELECT * FROM platform_fee_payments WHERE user_id = ? ORDER BY created_at DESC`,
      { replacements: [userId] }
    );
    
    res.json({ success: true, payments });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { 
  initPlatformFeePayment, 
  verifyPlatformFeePayment, 
  getPlatformFeeHistory 
};
