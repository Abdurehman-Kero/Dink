const { sequelize } = require('../config/database');
const { initializePayment, verifyPayment } = require('../services/chapaService');
const crypto = require('crypto');

// Initialize Chapa payment
const initPayment = async (req, res) => {
  try {
    const { order_id, total_amount, user_email, user_phone, user_name } = req.body;
    
    console.log('Payment init request:', { order_id, total_amount, user_email });
    
    // Validate required fields
    if (!user_email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }
    
    // Get user ID
    const [users] = await sequelize.query(
      'SELECT id FROM users WHERE email = ?',
      { replacements: [user_email] }
    );
    
    if (users.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'User not found. Please login again.' 
      });
    }
    
    const userId = users[0].id;
    
    // Check if order already exists
    const [existingOrders] = await sequelize.query(
      'SELECT id FROM orders WHERE order_number = ?',
      { replacements: [order_id] }
    );
    
    let orderDbId;
    
    if (existingOrders.length === 0) {
      // Create order
      const subtotal = total_amount - (total_amount * 0.1);
      const serviceFee = total_amount * 0.1;
      
      const [result] = await sequelize.query(
        `INSERT INTO orders (id, user_id, order_number, subtotal, service_fee, total_amount, status, created_at)
         VALUES (REPLACE(UUID(), '-', ''), ?, ?, ?, ?, ?, 'pending', NOW())`,
        { replacements: [userId, order_id, subtotal, serviceFee, total_amount] }
      );
      
      const [newOrder] = await sequelize.query(
        'SELECT id FROM orders WHERE order_number = ?',
        { replacements: [order_id] }
      );
      orderDbId = newOrder[0]?.id;
    } else {
      orderDbId = existingOrders[0].id;
    }
    
    // Generate unique transaction reference for Chapa
    const tx_ref = `DEMS-${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
    
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
      tx_ref: tx_ref
    });
    
    if (paymentResult.success) {
      // Save transaction reference to database
      await sequelize.query(
        `INSERT INTO transactions (id, order_id, user_id, gross_amount, platform_fee, net_amount, status, tx_ref, created_at)
         VALUES (REPLACE(UUID(), '-', ''), ?, ?, ?, ?, ?, 'pending', ?, NOW())`,
        { replacements: [orderDbId, userId, total_amount, total_amount * 0.1, total_amount * 0.9, tx_ref] }
      );
      
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
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Payment initialization failed' 
    });
  }
};

// Chapa callback (webhook)
const chapaCallback = async (req, res) => {
  try {
    const { tx_ref, status } = req.body;
    
    console.log('Chapa callback received:', { tx_ref, status });
    
    if (status === 'success') {
      // Verify the payment
      const verification = await verifyPayment(tx_ref);
      
      if (verification.success) {
        // Update transaction status
        await sequelize.query(
          `UPDATE transactions SET status = 'completed', completed_at = NOW() WHERE tx_ref = ?`,
          { replacements: [tx_ref] }
        );
        
        // Get order details
        const [transactions] = await sequelize.query(
          `SELECT t.order_id FROM transactions t WHERE t.tx_ref = ?`,
          { replacements: [tx_ref] }
        );
        
        if (transactions.length > 0) {
          // Update order status
          await sequelize.query(
            `UPDATE orders SET status = 'paid', paid_at = NOW() WHERE id = ?`,
            { replacements: [transactions[0].order_id] }
          );
        }
      }
    }
    
    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Callback error:', error);
    res.status(500).json({ status: 'error' });
  }
};

// Verify payment (called from frontend after redirect)
const verifyPaymentStatus = async (req, res) => {
  try {
    const { tx_ref } = req.query;
    
    console.log('Verifying payment:', tx_ref);
    
    if (!tx_ref) {
      return res.status(400).json({ success: false, message: 'Transaction reference required' });
    }
    
    // Verify with Chapa
    const verification = await verifyPayment(tx_ref);
    
    if (verification.success) {
      // Update transaction status if not already updated
      await sequelize.query(
        `UPDATE transactions SET status = 'completed', completed_at = NOW() WHERE tx_ref = ? AND status != 'completed'`,
        { replacements: [tx_ref] }
      );
      
      // Get order details
      const [transactions] = await sequelize.query(
        `SELECT t.order_id, o.order_number FROM transactions t 
         JOIN orders o ON t.order_id = o.id 
         WHERE t.tx_ref = ?`,
        { replacements: [tx_ref] }
      );
      
      if (transactions.length > 0 && transactions[0].order_id) {
        await sequelize.query(
          `UPDATE orders SET status = 'paid', paid_at = NOW() WHERE id = ? AND status != 'paid'`,
          { replacements: [transactions[0].order_id] }
        );
      }
      
      res.json({
        success: true,
        status: 'completed',
        order_number: transactions[0]?.order_number,
        message: 'Payment verified successfully'
      });
    } else {
      res.json({
        success: false,
        status: verification.status,
        message: verification.message || 'Payment verification failed'
      });
    }
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Payment success page render
const paymentSuccess = async (req, res) => {
  try {
    const { tx_ref } = req.query;
    
    console.log('Payment success page accessed:', tx_ref);
    
    // Send success HTML page
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Payment Successful - DEMS</title>
        <style>
          body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: linear-gradient(135deg, #1e3a2f, #2d5a3f); }
          .container { text-align: center; background: white; padding: 40px; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); max-width: 500px; }
          .checkmark { width: 80px; height: 80px; background: #10b981; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px; }
          .checkmark svg { width: 50px; height: 50px; color: white; }
          h1 { color: #1e3a2f; margin-bottom: 10px; }
          p { color: #666; margin-bottom: 20px; }
          .btn { background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 20px; }
          .loading { margin-top: 20px; font-size: 12px; color: #999; }
        </style>
        <script>
          // Auto-redirect to frontend success page after 3 seconds
          setTimeout(function() {
            window.location.href = '${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/success?tx_ref=${tx_ref}';
          }, 3000);
        </script>
      </head>
      <body>
        <div class="container">
          <div class="checkmark">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1>Payment Successful!</h1>
          <p>Your transaction has been completed successfully.</p>
          <p>Redirecting to your tickets...</p>
          <div class="loading">Please wait...</div>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Payment success error:', error);
    res.status(500).send('Payment verification failed');
  }
};

module.exports = { initPayment, chapaCallback, verifyPaymentStatus, paymentSuccess };
