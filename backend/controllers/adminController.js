const { prisma } = require("../config/database");
const bcrypt = require("bcryptjs");
const { sendOrganizerApproval } = require("../services/notificationService");
const { sendAccountStatusEmail } = require("../services/emailService");
const { generateId } = require("../utils/id");

const SUPER_ADMIN_EMAIL = "nexussphere0974@gmail.com";

// Get all pending organizer applications
const getPendingOrganizers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role_id: 2,
        status: "pending",
      },
      include: {
        organizer_profile: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const pending = users.map((user) => ({
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      phone_number: user.phone,
      submitted_at: user.created_at,
      organization_name: user.organizer_profile?.organization_name || "N/A",
      organization_type:
        user.organizer_profile?.organization_type || "individual",
      website_url: user.organizer_profile?.website_url || null,
      bio: user.organizer_profile?.bio || "No bio provided",
      tax_id_number: user.organizer_profile?.tax_id_number || null,
      business_registration_number:
        user.organizer_profile?.business_registration_number || null,
      social_linkedin: user.organizer_profile?.social_linkedin || null,
      social_instagram: user.organizer_profile?.social_instagram || null,
      social_x: user.organizer_profile?.social_x || null,
      work_email: user.organizer_profile?.work_email || null,
    }));

    res.json({ success: true, pending });
  } catch (error) {
    console.error("Get pending organizers error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Approve organizer
const approveOrganizer = async (req, res) => {
  try {
    const { userId } = req.params;
    const updated = await prisma.user.updateMany({
      where: {
        id: userId,
        role_id: 2,
      },
      data: {
        status: "active",
      },
    });

    if (updated.count === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Organizer not found" });
    }

    await prisma.organizerProfile.upsert({
      where: { user_id: userId },
      update: {
        verification_status: "approved",
        approved_by_admin_id: req.user.id,
        approved_at: new Date(),
      },
      create: {
        user_id: userId,
        verification_status: "approved",
        approved_by_admin_id: req.user.id,
        approved_at: new Date(),
        organization_name: "Pending Update",
        organization_type: "individual",
        bio: "Pending Update",
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        full_name: true,
      },
    });

    if (user) {
      sendOrganizerApproval(user, "approved").catch((mailError) => {
        console.error(
          "Organizer approved email failed:",
          mailError.message || mailError,
        );
      });

      sendAccountStatusEmail(user, "active").catch((mailError) => {
        console.error(
          "Account status email failed:",
          mailError.message || mailError,
        );
      });
    }

    res.json({
      success: true,
      message: "Organizer approved successfully",
      email: user?.email,
    });
  } catch (error) {
    console.error("Approve organizer error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Reject organizer
const rejectOrganizer = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;
    const updated = await prisma.user.updateMany({
      where: {
        id: userId,
        role_id: 2,
      },
      data: {
        status: "rejected",
      },
    });

    if (updated.count === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Organizer not found" });
    }

    await prisma.organizerProfile.upsert({
      where: { user_id: userId },
      update: {
        verification_status: "rejected",
        approved_by_admin_id: req.user.id,
      },
      create: {
        user_id: userId,
        verification_status: "rejected",
        approved_by_admin_id: req.user.id,
        organization_name: "Rejected",
        organization_type: "individual",
        bio: "Rejected",
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        full_name: true,
      },
    });

    if (user) {
      sendOrganizerApproval(user, "rejected", reason || "").catch(
        (mailError) => {
          console.error(
            "Organizer rejected email failed:",
            mailError.message || mailError,
          );
        },
      );

      sendAccountStatusEmail(user, "rejected", reason || "").catch(
        (mailError) => {
          console.error(
            "Account status email failed:",
            mailError.message || mailError,
          );
        },
      );
    }

    res.json({ success: true, message: "Organizer rejected", reason });
  } catch (error) {
    console.error("Reject organizer error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all organizers (approved)
const getAllOrganizers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role_id: 2,
      },
      include: {
        organizer_profile: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const organizers = users.map((user) => ({
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      status: user.status,
      created_at: user.created_at,
      organization_name: user.organizer_profile?.organization_name || "N/A",
      verification_status:
        user.organizer_profile?.verification_status || "pending",
    }));

    res.json({ success: true, organizers });
  } catch (error) {
    console.error("Get organizers error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const totalUsers = await prisma.user.count();
    const totalOrganizers = await prisma.user.count({ where: { role_id: 2 } });
    const totalAttendees = await prisma.user.count({ where: { role_id: 3 } });
    const totalEvents = await prisma.event.count();
    const liveEvents = await prisma.event.count({
      where: {
        status: "published",
        start_datetime: { lte: now },
        end_datetime: { gte: now },
      },
    });
    const pendingApprovals = await prisma.user.count({
      where: {
        role_id: 2,
        status: "pending",
      },
    });

    const paidOrderItemAggregate = await prisma.orderItem.aggregate({
      where: {
        order: {
          status: "paid",
        },
      },
      _sum: {
        quantity: true,
        total_price: true,
      },
    });

    const totalTicketsSold = paidOrderItemAggregate._sum.quantity || 0;
    const totalRevenue = Number(paidOrderItemAggregate._sum.total_price || 0);

    res.json({
      success: true,
      stats: {
        total_users: totalUsers || 0,
        total_organizers: totalOrganizers || 0,
        total_attendees: totalAttendees || 0,
        total_events: totalEvents || 0,
        pending_approvals: pendingApprovals || 0,
        live_events: liveEvents || 0,
        total_revenue: totalRevenue,
        total_tickets_sold: totalTicketsSold,
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =====================================================
// ADMIN MANAGEMENT FUNCTIONS (Super Admin only)
// =====================================================

// Get all admins
const getAdmins = async (req, res) => {
  try {
    // Only super admin can view all admins
    if (req.user.email !== SUPER_ADMIN_EMAIL) {
      return res
        .status(403)
        .json({ message: "Only super admin can access this" });
    }

    const admins = await prisma.user.findMany({
      where: { role_id: 1 },
      select: {
        id: true,
        full_name: true,
        email: true,
        status: true,
        created_at: true,
      },
      orderBy: { created_at: "desc" },
    });

    res.json({ success: true, admins });
  } catch (error) {
    console.error("Get admins error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create new admin (only super admin)
const createAdmin = async (req, res) => {
  try {
    // Only super admin can create new admins
    if (req.user.email !== SUPER_ADMIN_EMAIL) {
      return res
        .status(403)
        .json({ message: "Only super admin can create new admins" });
    }

    const { full_name, email, password, phone } = req.body;

    if (!full_name || !email || !password) {
      return res
        .status(400)
        .json({ message: "full_name, email, and password are required" });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user (role_id = 1)
    await prisma.user.create({
      data: {
        id: generateId(),
        role_id: 1,
        full_name,
        email,
        password_hash: hashedPassword,
        phone: phone || null,
        user_name: email.split("@")[0],
        status: "active",
        email_verified: true,
      },
    });

    res
      .status(201)
      .json({ success: true, message: `Admin created successfully!` });
  } catch (error) {
    console.error("Create admin error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update admin status
const updateAdminStatus = async (req, res) => {
  try {
    if (req.user.email !== SUPER_ADMIN_EMAIL) {
      return res.status(403).json({ message: "Only super admin can do this" });
    }

    const { adminId } = req.params;
    const { status } = req.body;

    const allowedStatuses = new Set([
      "active",
      "pending",
      "suspended",
      "deleted",
      "rejected",
    ]);
    if (!allowedStatuses.has(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updated = await prisma.user.updateMany({
      where: {
        id: adminId,
        role_id: 1,
      },
      data: {
        status,
      },
    });

    if (updated.count === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({ success: true, message: "Admin status updated" });
  } catch (error) {
    console.error("Update admin error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete admin
const deleteAdmin = async (req, res) => {
  try {
    if (req.user.email !== SUPER_ADMIN_EMAIL) {
      return res.status(403).json({ message: "Only super admin can do this" });
    }

    const { adminId } = req.params;

    // Check if trying to delete super admin
    const admin = await prisma.user.findFirst({
      where: {
        id: adminId,
        role_id: 1,
      },
      select: {
        email: true,
      },
    });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (admin.email === SUPER_ADMIN_EMAIL) {
      return res
        .status(400)
        .json({ message: "Cannot delete super admin account" });
    }

    await prisma.user.delete({ where: { id: adminId } });

    res.json({ success: true, message: "Admin deleted" });
  } catch (error) {
    console.error("Delete admin error:", error);
    res.status(500).json({ message: "Server error" });
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
  deleteAdmin,
};
