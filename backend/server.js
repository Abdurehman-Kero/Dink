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

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const staffRoutes = require('./routes/staffRoutes');

const app = express();

connectDB();

app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(limiter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'DEMS Backend is running',
    timestamp: new Date().toISOString()
  });
});
const notificationRoutes = require('./routes/notificationRoutes');
app.use('/api/notifications', notificationRoutes);
const reviewRoutes = require('./routes/reviewRoutes');
app.use('/api/reviews', reviewRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/staff', staffRoutes);
const paymentRoutes = require("./routes/paymentRoutes");
app.use("/api/payments", paymentRoutes);
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n��� DEMS Backend is running!`);
  console.log(`��� URL: http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
  console.log(`��� Auth API: http://localhost:${PORT}/api/auth`);
  console.log(`��� Events API: http://localhost:${PORT}/api/events`);
  console.log(`��� Staff API: http://localhost:${PORT}/api/staff`);
  console.log(`��� Environment: ${process.env.NODE_ENV || 'development'}\n`);
});
