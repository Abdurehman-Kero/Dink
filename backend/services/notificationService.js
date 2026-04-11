const nodemailer = require('nodemailer');
const { sequelize } = require('../config/database');

// Email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send ticket purchase confirmation
const sendTicketConfirmation = async (user, order, tickets) => {
  const ticketList = tickets.map(t => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${t.event_title}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${t.ticket_type}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${t.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">ETB ${t.price}</td>
    </tr>
  `).join('');
  
  const mailOptions = {
    from: `"DEMS Team" <${process.env.EMAIL_FROM || 'noreply@dems.com'}>`,
    to: user.email,
    subject: `Ticket Purchase Confirmation - Order #${order.order_number}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e3a2f, #2d5a3f); padding: 20px; text-align: center;">
          <h1 style="color: white;">DEMS Event Platform</h1>
        </div>
        <div style="padding: 30px; background: white;">
          <h2>Thank you for your purchase, ${user.full_name}!</h2>
          <p>Your order has been confirmed. Here are your ticket details:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background: #f3f4f6;">
                <th style="padding: 10px; text-align: left;">Event</th>
                <th style="padding: 10px; text-align: left;">Ticket Type</th>
                <th style="padding: 10px; text-align: left;">Qty</th>
                <th style="padding: 10px; text-align: left;">Price</th>
              </tr>
            </thead>
            <tbody>${ticketList}</tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 10px; text-align: right;"><strong>Total:</strong></td>
                <td style="padding: 10px;"><strong>ETB ${order.total_amount}</strong></td>
              </tr>
            </tfoot>
          </table>
          
          <p>Your tickets are available in your account. You can access them anytime from the "My Tickets" section.</p>
          
          <a href="${process.env.FRONTEND_URL}/my-tickets" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">
            View My Tickets
          </a>
          
          <hr style="margin: 20px 0;" />
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            © ${new Date().getFullYear()} DEMS Event Platform. All rights reserved.
          </p>
        </div>
      </div>
    `,
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Ticket confirmation sent to ${user.email}`);
    
    // Save notification to database
    await sequelize.query(`
      INSERT INTO notifications (id, user_id, type, title, message, created_at)
      VALUES (REPLACE(UUID(), '-', ''), ?, 'purchase', 'Ticket Purchase Confirmed', 
      'Your order #${order.order_number} has been confirmed. Total: ETB ${order.total_amount}', NOW())
    `, { replacements: [user.id] });
    
  } catch (error) {
    console.error('Email send failed:', error.message);
  }
};

// Send event reminder
const sendEventReminder = async (user, event) => {
  const mailOptions = {
    from: `"DEMS Team" <${process.env.EMAIL_FROM || 'noreply@dems.com'}>`,
    to: user.email,
    subject: `Reminder: ${event.title} is tomorrow!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1e3a2f; padding: 20px; text-align: center;">
          <h1 style="color: white;">Event Reminder</h1>
        </div>
        <div style="padding: 30px;">
          <h2>${event.title}</h2>
          <p><strong>Date:</strong> ${new Date(event.start_datetime).toLocaleString()}</p>
          <p><strong>Location:</strong> ${event.venue_name}, ${event.city}</p>
          <p>Don't forget to bring your digital ticket for scanning at the entrance.</p>
          <a href="${process.env.FRONTEND_URL}/my-tickets" style="background: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View My Tickets</a>
        </div>
      </div>
    `,
  };
  
  await transporter.sendMail(mailOptions);
};

// Send organizer approval notification
const sendOrganizerApproval = async (organizer, status, reason = '') => {
  const subject = status === 'approved' ? 'Organizer Application Approved!' : 'Organizer Application Update';
  const message = status === 'approved' 
    ? 'Congratulations! Your organizer application has been approved. You can now start creating events.'
    : `Your organizer application has been reviewed. Status: ${status}. ${reason ? `Reason: ${reason}` : ''}`;
  
  const mailOptions = {
    from: `"DEMS Team" <${process.env.EMAIL_FROM || 'noreply@dems.com'}>`,
    to: organizer.email,
    subject: subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1e3a2f; padding: 20px; text-align: center;">
          <h1 style="color: white;">DEMS Event Platform</h1>
        </div>
        <div style="padding: 30px;">
          <h2>Dear ${organizer.full_name},</h2>
          <p>${message}</p>
          ${status === 'approved' ? `
            <a href="${process.env.FRONTEND_URL}/organizer/dashboard" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">
              Go to Dashboard
            </a>
          ` : ''}
        </div>
      </div>
    `,
  };
  
  await transporter.sendMail(mailOptions);
};

// Get user notifications
const getUserNotifications = async (req, res) => {
  try {
    const [notifications] = await sequelize.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      { replacements: [req.user.id] }
    );
    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    await sequelize.query(
      'UPDATE notifications SET read_at = NOW() WHERE id = ? AND user_id = ?',
      { replacements: [req.params.id, req.user.id] }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { 
  sendTicketConfirmation, 
  sendEventReminder, 
  sendOrganizerApproval,
  getUserNotifications,
  markAsRead
};
