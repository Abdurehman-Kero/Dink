const { sequelize } = require('../config/database');
const { initializePayment, verifyPayment: chapaVerifyPayment } = require('../services/chapaService');
const crypto = require('crypto');

// Initialize payment for ticket purchase
const initPayment = async (req, res) => {
  try {
    const { order_id, total_amount, user_email, user_phone, user_name } = req.body;
    const userId = req.user.id;
    
    console.log('Payment init request:', { order_id, total_amount, user_email });
    
    if (!user_email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    
    // Get user ID
    const [users] = await sequelize.query(
      'SELECT id FROM users WHERE email = ?',
      { replacements: [user_email] }
    );
    
    if (users.length === 0) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }
    
    // Generate unique transaction reference
    const tx_ref = `TICKET-${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
    
    // Create order
    const subtotal = total_amount - (total_amount * 0.1);
    const serviceFee = total_amount * 0.1;
    
    await sequelize.query(
      `INSERT INTO orders (id, user_id, order_number, subtotal, service_fee, total_amount, status, tx_ref, created_at)
       VALUES (REPLACE(UUID(), '-', ''), ?, ?, ?, ?, ?, 'pending', ?, NOW())`,
      { replacements: [userId, order_id, subtotal, serviceFee, total_amount, tx_ref] }
    );
    
    // Split name for Chapa
    const nameParts = (user_name || 'DEMS User').split(' ');
    const first_name = nameParts[0];
    const last_name = nameParts.slice(1).join(' ') || 'User';
    
    // Initialize Chapa payment
    const paymentResult = await initializePayment({
      amount: total_amount,
      email: user_email,
      first_name: first_name,
      last_name: last_name,
      phone_number: user_phone || '0912345678',
      tx_ref: tx_ref,
      title: 'DEMS Tickets',
      description: `Ticket purchase - Order ${order_id}`
    });
    
    if (paymentResult.success && paymentResult.checkout_url) {
      res.json({
        success: true,
        checkout_url: paymentResult.checkout_url,
        tx_ref: tx_ref
      });
    } else {
      res.status(400).json({
        success: false,
        message: paymentResult.message || 'Payment initialization failed'
      });
    }
  } catch (error) {
    console.error('Init payment error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify payment (called from frontend after redirect)
const verifyPayment = async (req, res) => {
  try {
    const { tx_ref } = req.query;
    
    console.log('Verifying payment for tx_ref:', tx_ref);
    
    if (!tx_ref) {
      return res.status(400).json({ success: false, message: 'Transaction reference required' });
    }
    
    // Check in orders table first
    let [orders] = await sequelize.query(
      'SELECT * FROM orders WHERE tx_ref = ?',
      { replacements: [tx_ref] }
    );
    
    if (orders.length === 0) {
      // Try platform fee payments
      let [platformPayments] = await sequelize.query(
        'SELECT * FROM platform_fee_payments WHERE tx_ref = ?',
        { replacements: [tx_ref] }
      );
      
      if (platformPayments.length === 0) {
        return res.json({ 
          success: false, 
          status: 'not_found', 
          message: 'Transaction not found' 
        });
      }
      
      const payment = platformPayments[0];
      
      if (payment.status === 'completed') {
        return res.json({
          success: true,
          status: 'completed',
          message: 'Payment verified successfully'
        });
      }
      
      // Verify with Chapa
      const verification = await chapaVerifyPayment(tx_ref);
      
      if (verification.success) {
        await sequelize.query(
          `UPDATE platform_fee_payments SET status = 'completed', completed_at = NOW() WHERE tx_ref = ?`,
          { replacements: [tx_ref] }
        );
        
        return res.json({
          success: true,
          status: 'completed',
          message: 'Payment verified successfully'
        });
      }
      
      return res.json({
        success: false,
        status: verification.status,
        message: verification.message || 'Payment verification failed'
      });
    }
    
    const order = orders[0];
    
    if (order.status === 'paid') {
      return res.json({
        success: true,
        status: 'completed',
        message: 'Payment verified successfully',
        order_number: order.order_number
      });
    }
    
    // Verify with Chapa
    const verification = await chapaVerifyPayment(tx_ref);
    
    if (verification.success) {
      await sequelize.query(
        `UPDATE orders SET status = 'paid', paid_at = NOW() WHERE tx_ref = ?`,
        { replacements: [tx_ref] }
      );
      
      return res.json({
        success: true,
        status: 'completed',
        message: 'Payment verified successfully',
        order_number: order.order_number
      });
    }
    
    res.json({
      success: false,
      status: 'pending',
      message: 'Payment not completed'
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { initPayment, verifyPayment };
