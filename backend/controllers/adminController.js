const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// Get all admins
const getAdmins = async (req, res) => {
  try {
    // Only super admin can view all admins
    if (req.user.email !== 'nexussphere0974@gmail.com') {
      return res.status(403).json({ message: 'Only super admin can access this' });
    }
    
    const [admins] = await sequelize.query(
      'SELECT id, full_name, email, status, created_at FROM users WHERE role_id = 1'
    );
    res.json({ success: true, admins });
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new admin (only super admin)
const createAdmin = async (req, res) => {
  try {
    // Only super admin can create new admins
    if (req.user.email !== 'nexussphere0974@gmail.com') {
      return res.status(403).json({ message: 'Only super admin can create new admins' });
    }
    
    const { full_name, email, password, phone } = req.body;
    
    // Check if user exists
    const [existingUser] = await sequelize.query(
      'SELECT id FROM users WHERE email = ?',
      { replacements: [email] }
    );
    
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create admin user (role_id = 1)
    await sequelize.query(`
      INSERT INTO users (id, role_id, full_name, email, password_hash, user_name, status, email_verified)
      VALUES (REPLACE(UUID(), '-', ''), 1, ?, ?, ?, ?, 'active', true)
    `, { replacements: [full_name, email, hashedPassword, email.split('@')[0]] });
    
    // Send email notification
    sendAdminInvitation(email, password, full_name);
    
    res.status(201).json({ success: true, message: `Admin created successfully! Email sent to ${email}` });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Send admin invitation email
const sendAdminInvitation = async (email, password, fullName) => {
  const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`;
  
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  
  const mailOptions = {
    from: `"DEMS Admin" <${process.env.EMAIL_FROM || 'noreply@dems.com'}>`,
    to: email,
    subject: 'You have been added as an Admin - DEMS',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e3a2f, #2d5a3f); padding: 20px; text-align: center;">
          <h1 style="color: white;">DEMS Admin Portal</h1>
        </div>
        <div style="padding: 30px; background: white;">
          <h2>Dear ${fullName},</h2>
          <p>You have been added as an Administrator for the DEMS Event Platform.</p>
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Your Login Credentials:</h3>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Password:</strong> ${password}</p>
          </div>
          <a href="${loginUrl}" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">Login to Admin Panel</a>
        </div>
      </div>
    `,
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Admin invitation sent to ${email}`);
  } catch (error) {
    console.error('Email send failed:', error.message);
  }
};

// Update admin status (activate/deactivate)
const updateAdminStatus = async (req, res) => {
  try {
    if (req.user.email !== 'nexussphere0974@gmail.com') {
      return res.status(403).json({ message: 'Only super admin can do this' });
    }
    
    const { adminId, status } = req.body;
    await sequelize.query(
      'UPDATE users SET status = ? WHERE id = ? AND role_id = 1',
      { replacements: [status, adminId] }
    );
    
    res.json({ success: true, message: 'Admin status updated' });
  } catch (error) {
    console.error('Update admin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete admin
const deleteAdmin = async (req, res) => {
  try {
    if (req.user.email !== 'nexussphere0974@gmail.com') {
      return res.status(403).json({ message: 'Only super admin can do this' });
    }
    
    const { adminId } = req.params;
    await sequelize.query('DELETE FROM users WHERE id = ? AND role_id = 1', { replacements: [adminId] });
    
    res.json({ success: true, message: 'Admin deleted' });
  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAdmins, createAdmin, updateAdminStatus, deleteAdmin };
