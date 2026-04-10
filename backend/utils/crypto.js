const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Hash password
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Compare password
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Hash OTP
const hashOTP = (otp) => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

// Generate OTP (6 digits)
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Verify OTP
const verifyOTP = (inputOTP, hashedOTP) => {
  return hashOTP(inputOTP) === hashedOTP;
};

module.exports = {
  hashPassword,
  comparePassword,
  hashOTP,
  generateOTP,
  verifyOTP
};
