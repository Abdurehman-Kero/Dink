const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const { connectDB } = require('./config/database');
const { errorHandler } = require('./middleware/errorMiddleware');
const { limiter } = require('./middleware/rateLimitMiddleware');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const staffRoutes = require('./routes/staffRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const payoutRoutes = require('./routes/payoutRoutes');
const platformFeeRoutes = require('./routes/platformFeeRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const analyticsRoutes = require("./routes/analyticsRoutes");
// Admin Management Routes
const adminEventRoutes = require('./routes/adminEventRoutes');
const adminCategoryRoutes = require('./routes/adminCategoryRoutes');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(limiter);

// Static Files
const uploadRoutes = require("./routes/uploadRoutes");
app.use("/api/upload", uploadRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'DEMS Backend is running',
    timestamp: new Date().toISOString()
  });
});

// =====================================================
// API Routes
// =====================================================

// Authentication Routes
app.use('/api/auth', authRoutes);

// Event Routes
app.use('/api/events', eventRoutes);

// Staff Routes
app.use('/api/staff', staffRoutes);

// Admin Routes (Main)
app.use('/api/admin', adminRoutes);

// Admin Event Management Routes
app.use('/api/admin', adminEventRoutes);

// Admin Category Management Routes
app.use('/api/admin', adminCategoryRoutes);

// Category Routes (Public)
app.use('/api/categories', categoryRoutes);

// Notification Routes
app.use('/api/notifications', notificationRoutes);

// Review Routes
app.use('/api/reviews', reviewRoutes);

// Payment Routes (Attendee pays for tickets)
app.use('/api/payments', paymentRoutes);

// Payout Routes (Organizer receives money)
app.use('/api/payouts', payoutRoutes);

// Platform Fee Routes (Organizer pays admin)
app.use('/api/platform-fee', platformFeeRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.originalUrl} not found` 
  });
});

// Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n��� DEMS Backend is running!`);
  console.log(`��� URL: http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
  console.log(`��� Auth API: http://localhost:${PORT}/api/auth`);
  console.log(`��� Events API: http://localhost:${PORT}/api/events`);
  console.log(`��� Staff API: http://localhost:${PORT}/api/staff`);
  console.log(`��� Admin API: http://localhost:${PORT}/api/admin`);
  console.log(`��� Notifications API: http://localhost:${PORT}/api/notifications`);
  console.log(`⭐ Reviews API: http://localhost:${PORT}/api/reviews`);
  console.log(`��� Payments API (Attendee → Organizer): http://localhost:${PORT}/api/payments`);
  console.log(`��� Payouts API (Organizer receives): http://localhost:${PORT}/api/payouts`);
  console.log(`��� Platform Fee API (Organizer → Admin): http://localhost:${PORT}/api/platform-fee`);
  console.log(`���️ Categories API: http://localhost:${PORT}/api/categories`);
  console.log(`��� Environment: ${process.env.NODE_ENV || 'development'}\n`);
});
