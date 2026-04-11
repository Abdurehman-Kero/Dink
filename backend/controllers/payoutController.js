const { sequelize } = require('../config/database');
const { initializePayment, verifyPayment } = require('../services/chapaService');
const crypto = require('crypto');

// Initialize payout (Organizer receives money)
const initPayout = async (req, res) => {
  try {
    const { amount, method, details } = req.body;
    const userId = req.user.id;
    
    console.log('Payout request:', { amount, method, userId });
    
    const tx_ref = `PAYOUT-${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
    
    // Create payouts table if not exists
    try {
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS payouts (
          id VARCHAR(36) PRIMARY KEY,
          user_id VARCHAR(36) NOT NULL,
          amount DECIMAL(10,2) NOT NULL,
          method VARCHAR(50),
          details TEXT,
          status VARCHAR(50) DEFAULT 'pending',
          tx_ref VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          completed_at DATETIME,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);
    } catch (err) {
      console.log('Table may already exist');
    }
    
    await sequelize.query(
      `INSERT INTO payouts (id, user_id, amount, method, details, status, tx_ref, created_at)
       VALUES (REPLACE(UUID(), '-', ''), ?, ?, ?, ?, 'pending', ?, NOW())`,
      { replacements: [userId, amount, method, JSON.stringify(details), tx_ref] }
    );
    
    res.json({
      success: true,
      message: 'Payout request initiated',
      tx_ref: tx_ref
    });
  } catch (error) {
    console.error('Init payout error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get payout history
const getPayoutHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [payouts] = await sequelize.query(
      `SELECT * FROM payouts WHERE user_id = ? ORDER BY created_at DESC`,
      { replacements: [userId] }
    );
    
    res.json({ success: true, payouts });
  } catch (error) {
    console.error('Get payout history error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { initPayout, getPayoutHistory };
