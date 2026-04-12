const { sequelize } = require('../config/database');
const { initializePayment, verifyPayment: chapaVerifyPayment } = require('../services/chapaService');
const crypto = require('crypto');

// Initialize payment for ticket purchase
const initPayment = async (req, res) => {
  try {
    const { order_id, total_amount, user_email, user_phone, user_name, items } = req.body;
    const userId = req.user.id;
    
    console.log('Payment init request:', { order_id, total_amount, user_email, items });
    
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
    
    // Calculate totals
    const subtotal = total_amount - (total_amount * 0.1);
    const serviceFee = total_amount * 0.1;
    
    // Create order
    await sequelize.query(
      `INSERT INTO orders (id, user_id, order_number, subtotal, service_fee, total_amount, status, tx_ref, created_at)
       VALUES (REPLACE(UUID(), '-', ''), ?, ?, ?, ?, ?, 'pending', ?, NOW())`,
      { replacements: [userId, order_id, subtotal, serviceFee, total_amount, tx_ref] }
    );
    
    // Get the order ID
    const [newOrder] = await sequelize.query(
      'SELECT id FROM orders WHERE order_number = ?',
      { replacements: [order_id] }
    );
    const orderDbId = newOrder[0]?.id;
    
    // Save order items
    if (items && items.length > 0) {
      for (const item of items) {
        await sequelize.query(
          `INSERT INTO order_items (id, order_id, ticket_type_id, quantity, unit_price, subtotal)
           VALUES (REPLACE(UUID(), '-', ''), ?, ?, ?, ?, ?)`,
          { replacements: [orderDbId, item.ticket_type_id, item.quantity, item.unit_price, item.subtotal] }
        );
      }
    }
    
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
    
    // Check in orders table
    let [orders] = await sequelize.query(
      'SELECT * FROM orders WHERE tx_ref = ?',
      { replacements: [tx_ref] }
    );
    
    if (orders.length === 0) {
      return res.json({ 
        success: false, 
        status: 'not_found', 
        message: 'Transaction not found' 
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
      // Update order status
      await sequelize.query(
        `UPDATE orders SET status = 'paid', paid_at = NOW() WHERE tx_ref = ?`,
        { replacements: [tx_ref] }
      );
      
      // Get order items to update ticket quantities
      const [orderItems] = await sequelize.query(
        `SELECT oi.*, tt.event_id, tt.tier_name 
         FROM order_items oi
         JOIN ticket_types tt ON oi.ticket_type_id = tt.id
         WHERE oi.order_id = ?`,
        { replacements: [order.id] }
      );
      
      // Update ticket quantities and create digital tickets
      for (const item of orderItems) {
        // Update remaining quantity in ticket_types
        await sequelize.query(
          `UPDATE ticket_types SET remaining_quantity = remaining_quantity - ? WHERE id = ?`,
          { replacements: [item.quantity, item.ticket_type_id] }
        );
        
        // Create digital tickets for each ticket purchased
        for (let i = 0; i < item.quantity; i++) {
          const ticketCode = `DEMS-${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
          await sequelize.query(
            `INSERT INTO digital_tickets (id, order_id, event_id, ticket_type_id, ticket_code, qr_payload, purchase_date, status)
             VALUES (REPLACE(UUID(), '-', ''), ?, ?, ?, ?, ?, NOW(), 'active')`,
            { replacements: [order.id, item.event_id, item.ticket_type_id, ticketCode, JSON.stringify({ code: ticketCode })] }
          );
        }
        
        // Also update event_attendance_stats for live stats
        await sequelize.query(`
          INSERT INTO event_attendance_stats (id, event_id, tickets_sold_total, checked_in_total, normal_sold, vip_sold, vvip_sold)
          VALUES (REPLACE(UUID(), '-', ''), ?, ?, 0, 
            CASE WHEN ? = 'Normal' THEN ? ELSE 0 END,
            CASE WHEN ? = 'VIP' THEN ? ELSE 0 END,
            CASE WHEN ? = 'VVIP' THEN ? ELSE 0 END
          )
          ON DUPLICATE KEY UPDATE
            tickets_sold_total = tickets_sold_total + ?,
            normal_sold = normal_sold + (CASE WHEN ? = 'Normal' THEN ? ELSE 0 END),
            vip_sold = vip_sold + (CASE WHEN ? = 'VIP' THEN ? ELSE 0 END),
            vvip_sold = vvip_sold + (CASE WHEN ? = 'VVIP' THEN ? ELSE 0 END)
        `, { 
          replacements: [
            item.event_id, item.quantity,
            item.tier_name, item.quantity,
            item.tier_name, item.quantity,
            item.tier_name, item.quantity,
            item.quantity,
            item.tier_name, item.quantity,
            item.tier_name, item.quantity,
            item.tier_name, item.quantity
          ] 
        });
      }
      
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
