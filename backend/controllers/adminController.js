const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

// Get all pending organizer applications
const getPendingOrganizers = async (req, res) => {
  try {
    console.log('Fetching pending organizers...');
    
    const [pending] = await sequelize.query(`
      SELECT 
        u.id, 
        u.full_name, 
        u.email, 
        u.phone as phone_number, 
        u.created_at as submitted_at,
        COALESCE(op.organization_name, 'N/A') as organization_name,
        COALESCE(op.organization_type, 'individual') as organization_type,
        op.website_url, 
        COALESCE(op.bio, 'No bio provided') as bio,
        op.tax_id_number, 
        op.business_registration_number,
        op.social_linkedin, 
        op.social_instagram, 
        op.social_x, 
        op.work_email
      FROM users u
      LEFT JOIN organizer_profiles op ON u.id = op.user_id
      WHERE u.role_id = 2 AND u.status = 'pending'
      ORDER BY u.created_at DESC
    `);
    
    console.log(`Found ${pending.length} pending organizers`);
    res.json({ success: true, pending });
  } catch (error) {
    console.error('Get pending organizers error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Approve organizer
const approveOrganizer = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`Approving organizer: ${userId}`);
    
    await sequelize.query(
      'UPDATE users SET status = "active", updated_at = NOW() WHERE id = ? AND role_id = 2',
      { replacements: [userId] }
    );
    
    await sequelize.query(`
      INSERT INTO organizer_profiles (user_id, verification_status, approved_by_admin_id, approved_at, organization_name, organization_type, bio)
      VALUES (?, 'approved', ?, NOW(), 'Pending Update', 'individual', 'Pending Update')
      ON DUPLICATE KEY UPDATE 
        verification_status = 'approved', 
        approved_by_admin_id = ?, 
        approved_at = NOW()
    `, { replacements: [userId, req.user.id, req.user.id] });
    
    const [user] = await sequelize.query(
      'SELECT email, full_name FROM users WHERE id = ?',
      { replacements: [userId] }
    );
    
    console.log(`Organizer ${userId} approved successfully`);
    res.json({ success: true, message: 'Organizer approved successfully', email: user[0]?.email });
  } catch (error) {
    console.error('Approve organizer error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Reject organizer
const rejectOrganizer = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;
    console.log(`Rejecting organizer: ${userId}, reason: ${reason}`);
    
    await sequelize.query(
      'UPDATE users SET status = "rejected", updated_at = NOW() WHERE id = ? AND role_id = 2',
      { replacements: [userId] }
    );
    
    await sequelize.query(`
      INSERT INTO organizer_profiles (user_id, verification_status, approved_by_admin_id, organization_name, organization_type, bio)
      VALUES (?, 'rejected', ?, 'Rejected', 'individual', 'Rejected')
      ON DUPLICATE KEY UPDATE 
        verification_status = 'rejected', 
        approved_by_admin_id = ?
    `, { replacements: [userId, req.user.id, req.user.id] });
    
    res.json({ success: true, message: 'Organizer rejected', reason });
  } catch (error) {
    console.error('Reject organizer error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all organizers (approved)
const getAllOrganizers = async (req, res) => {
  try {
    const [organizers] = await sequelize.query(`
      SELECT u.id, u.full_name, u.email, u.status, u.created_at,
             COALESCE(op.organization_name, 'N/A') as organization_name,
             COALESCE(op.verification_status, 'pending') as verification_status
      FROM users u
      LEFT JOIN organizer_profiles op ON u.id = op.user_id
      WHERE u.role_id = 2
      ORDER BY u.created_at DESC
    `);
    res.json({ success: true, organizers });
  } catch (error) {
    console.error('Get organizers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers] = await sequelize.query('SELECT COUNT(*) as count FROM users');
    const [totalOrganizers] = await sequelize.query('SELECT COUNT(*) as count FROM users WHERE role_id = 2');
    const [totalAttendees] = await sequelize.query('SELECT COUNT(*) as count FROM users WHERE role_id = 3');
    const [totalEvents] = await sequelize.query('SELECT COUNT(*) as count FROM events');
    const [pendingApprovals] = await sequelize.query('SELECT COUNT(*) as count FROM users WHERE role_id = 2 AND status = "pending"');
    
    res.json({
      success: true,
      stats: {
        total_users: totalUsers[0]?.count || 0,
        total_organizers: totalOrganizers[0]?.count || 0,
        total_attendees: totalAttendees[0]?.count || 0,
        total_events: totalEvents[0]?.count || 0,
        pending_approvals: pendingApprovals[0]?.count || 0,
        live_events: 0,
        total_revenue: 0,
        total_tickets_sold: 0
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// =====================================================
// ADMIN MANAGEMENT FUNCTIONS (Super Admin only)
// =====================================================

// Get all admins
const getAdmins = async (req, res) => {
  try {
    // Only super admin can view all admins
    if (req.user.email !== 'nexussphere0974@gmail.com') {
      return res.status(403).json({ message: 'Only super admin can access this' });
    }
    
    const [admins] = await sequelize.query(`
      SELECT id, full_name, email, status, created_at 
      FROM users 
      WHERE role_id = 1
      ORDER BY created_at DESC
    `);
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
    
    res.status(201).json({ success: true, message: `Admin created successfully!` });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update admin status
const updateAdminStatus = async (req, res) => {
  try {
    if (req.user.email !== 'nexussphere0974@gmail.com') {
      return res.status(403).json({ message: 'Only super admin can do this' });
    }
    
    const { adminId } = req.params;
    const { status } = req.body;
    
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
    
    // Check if trying to delete super admin
    const [admin] = await sequelize.query(
      'SELECT email FROM users WHERE id = ? AND role_id = 1',
      { replacements: [adminId] }
    );
    
    if (admin.length > 0 && admin[0].email === 'nexussphere0974@gmail.com') {
      return res.status(400).json({ message: 'Cannot delete super admin account' });
    }
    
    await sequelize.query('DELETE FROM users WHERE id = ? AND role_id = 1', { replacements: [adminId] });
    
    res.json({ success: true, message: 'Admin deleted' });
  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { 
  getPendingOrganizers, 
  approveOrganizer, 
  rejectOrganizer, 
  getAllOrganizers,
  getDashboardStats,
  getAdmins,
  createAdmin,
  updateAdminStatus,
  deleteAdmin
};
