const { prisma } = require('../config/database');
const { initializePayment } = require('../services/chapaService');
const crypto = require('crypto');
const { isValidEmail } = require('../utils/helpers');
const { generateId } = require('../utils/id');

const initPlatformFeePayment = async (req, res) => {
  try {
    const { amount, payment_method } = req.body;
    const userId = req.user.id;
    
    // Validate amount
    if (!amount || amount < 500) {
      return res.status(400).json({ 
        success: false, 
        message: 'Minimum payment amount is ETB 500' 
      });
    }
    
    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        full_name: true
      }
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Validate email format
    if (!isValidEmail(user.email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email format. Please update your profile with a valid email address.' 
      });
    }
    
    const tx_ref = `PLATFORM-${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
    
    await prisma.platformFeePayment.create({
      data: {
        id: generateId(),
        user_id: userId,
        amount: Number(amount),
        payment_method: payment_method || 'telebirr',
        status: 'pending',
        tx_ref
      }
    });
    
    const nameParts = (user.full_name || 'Organizer User').split(' ');
    const first_name = nameParts[0];
    const last_name = nameParts.slice(1).join(' ') || 'User';
    
    // Ensure phone number is valid Ethiopian format
    const phoneNumber = '0912345678';
    
    const paymentResult = await initializePayment({
      amount: amount,
      email: user.email,
      first_name: first_name,
      last_name: last_name,
      phone_number: phoneNumber,
      tx_ref: tx_ref,
      title: 'DEMS Platform Fee',
      description: `Platform fee payment of ETB ${amount}`
    });
    
    if (paymentResult.success && paymentResult.checkout_url) {
      return res.json({
        success: true,
        checkout_url: paymentResult.checkout_url,
        tx_ref: tx_ref
      });
    } else {
      return res.status(400).json({
        success: false,
        message: paymentResult.message || 'Payment initialization failed. Please try again.'
      });
    }
  } catch (error) {
    console.error('Init platform fee error:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Internal server error' 
    });
  }
};

const verifyPlatformFeePayment = async (req, res) => {
  try {
    const { tx_ref, status } = req.body;

    if (status === 'success') {
      await prisma.platformFeePayment.updateMany({
        where: { tx_ref },
        data: {
          status: 'completed',
          completed_at: new Date()
        }
      });
    }
    
    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Platform fee callback error:', error);
    res.status(500).json({ status: 'error' });
  }
};

const getPlatformFeeHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const payments = await prisma.platformFeePayment.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    });

    res.json({ success: true, payments });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { 
  initPlatformFeePayment, 
  verifyPlatformFeePayment, 
  getPlatformFeeHistory 
};
