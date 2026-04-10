const crypto = require('crypto');

// Generate random token
const generateToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Format date to Ethiopian format
const formatEthiopianDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Calculate service fee (10%)
const calculateServiceFee = (amount) => {
  return amount * 0.1;
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate Ethiopian phone number
const isValidEthiopianPhone = (phone) => {
  const phoneRegex = /^(\+251|0)[1-9]\d{8}$/;
  return phoneRegex.test(phone);
};

// Generate QR code payload
const generateQRPayload = (ticketId, eventId, userId) => {
  return JSON.stringify({
    ticketId,
    eventId,
    userId,
    timestamp: Date.now(),
    hash: crypto.createHash('sha256').update(`${ticketId}${eventId}${userId}`).digest('hex')
  });
};

// Pagination helper
const paginate = (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  return { limit: parseInt(limit), offset: parseInt(offset) };
};

module.exports = {
  generateToken,
  formatEthiopianDate,
  calculateServiceFee,
  isValidEmail,
  isValidEthiopianPhone,
  generateQRPayload,
  paginate
};
