const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const QRCode = require('qrcode');

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

const getTicketQrSecret = () => process.env.TICKET_QR_SECRET || process.env.JWT_SECRET || 'dems-secret-key';

const signTicketQrPayload = ({ ticket_id, event_id, attendee_id, ticket_code }) => {
  return jwt.sign(
    {
      v: 1,
      ticket_id,
      event_id,
      attendee_id,
      ticket_code
    },
    getTicketQrSecret(),
    {
      expiresIn: process.env.TICKET_QR_EXPIRES || '30d'
    }
  );
};

const verifyTicketQrPayload = (qr_token) => {
  return jwt.verify(qr_token, getTicketQrSecret());
};

const buildTicketQrDataUrl = async (qr_token) => {
  return QRCode.toDataURL(qr_token, {
    errorCorrectionLevel: 'M',
    margin: 1,
    width: 280
  });
};

module.exports = {
  hashPassword,
  comparePassword,
  hashOTP,
  generateOTP,
  verifyOTP,
  signTicketQrPayload,
  verifyTicketQrPayload,
  buildTicketQrDataUrl
};
