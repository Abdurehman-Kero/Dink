const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const { connectDB } = require('./config/database');
const { errorHandler } = require('./middleware/errorMiddleware');
const { limiter } = require('./middleware/rateLimitMiddleware');

// Import routes
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(limiter);

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'DEMS Backend is running with MAMP MySQL',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      events: '/api/events'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.originalUrl} not found` 
  });
});

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\nÌ∫Ä DEMS Backend is running!`);
  console.log(`Ì≥ç URL: http://localhost:${PORT}`);
  console.log(`‚úÖ Health check: http://localhost:${PORT}/health`);
  console.log(`Ì¥ê Auth API: http://localhost:${PORT}/api/auth`);
  console.log(`Ì≥Ö Events API: http://localhost:${PORT}/api/events`);
  console.log(`Ì≥ù Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Ìª¢Ô∏è  Database: MAMP MySQL on port ${process.env.DB_PORT || 8889}\n`);
});
