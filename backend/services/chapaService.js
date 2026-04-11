const axios = require('axios');
const crypto = require('crypto');

// Chapa API configuration
const CHAPA_API_URL = 'https://api.chapa.co/v1';
const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Initialize payment with Chapa
 */
const initializePayment = async (paymentDetails) => {
  try {
    const {
      amount,
      email,
      first_name,
      last_name,
      phone_number,
      tx_ref
    } = paymentDetails;

    // Validate required fields
    if (!amount || amount <= 0) {
      return {
        success: false,
        message: 'Invalid amount'
      };
    }
    
    if (!email || !isValidEmail(email)) {
      return {
        success: false,
        message: 'Valid email address is required'
      };
    }
    
    if (!tx_ref) {
      return {
        success: false,
        message: 'Transaction reference is required'
      };
    }

    // Format phone number for Ethiopia
    let formattedPhone = phone_number || '0912345678';
    // Remove any non-digit characters
    formattedPhone = formattedPhone.replace(/\D/g, '');
    // Ensure it starts with 0
    if (formattedPhone.startsWith('251')) {
      formattedPhone = '0' + formattedPhone.substring(3);
    }
    if (!formattedPhone.startsWith('0')) {
      formattedPhone = '0' + formattedPhone;
    }
    // Ensure it's 10 digits
    if (formattedPhone.length > 10) {
      formattedPhone = formattedPhone.substring(0, 10);
    }

    const requestBody = {
      amount: amount.toString(),
      currency: 'ETB',
      email: email.trim().toLowerCase(),
      first_name: (first_name || 'DEMS').trim(),
      last_name: (last_name || 'User').trim(),
      phone_number: formattedPhone,
      tx_ref: tx_ref,
      callback_url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payments/chapa/callback`,
      return_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/success?tx_ref=${tx_ref}`,
      customization: {
        title: 'DEMS Tickets',
        description: 'Event Ticket Purchase'
      }
    };

    console.log('Chapa request:', JSON.stringify(requestBody, null, 2));

    const response = await axios.post(
      `${CHAPA_API_URL}/transaction/initialize`,
      requestBody,
      {
        headers: {
          'Authorization': `Bearer ${CHAPA_SECRET_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    console.log('Chapa response status:', response.status);
    console.log('Chapa response data:', response.data);

    if (response.data && response.data.status === 'success') {
      return {
        success: true,
        checkout_url: response.data.data.checkout_url,
        tx_ref: tx_ref
      };
    } else {
      return {
        success: false,
        message: response.data?.message || 'Payment initialization failed'
      };
    }
  } catch (error) {
    console.error('Chapa payment initialization error:');
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    
    return {
      success: false,
      message: error.response?.data?.message || 'Payment service error. Please try again.'
    };
  }
};

/**
 * Verify payment status
 */
const verifyPayment = async (tx_ref) => {
  try {
    if (!tx_ref) {
      return {
        success: false,
        status: 'error',
        message: 'Transaction reference is required'
      };
    }

    const response = await axios.get(
      `${CHAPA_API_URL}/transaction/verify/${tx_ref}`,
      {
        headers: {
          'Authorization': `Bearer ${CHAPA_SECRET_KEY}`
        },
        timeout: 30000
      }
    );

    console.log('Chapa verification response:', response.data);

    if (response.data && response.data.status === 'success') {
      return {
        success: true,
        data: response.data.data,
        status: 'completed'
      };
    } else {
      return {
        success: false,
        status: 'failed',
        message: response.data?.message || 'Payment verification failed'
      };
    }
  } catch (error) {
    console.error('Chapa verification error:');
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received');
    } else {
      console.error('Error message:', error.message);
    }
    
    return {
      success: false,
      status: 'error',
      message: error.response?.data?.message || 'Verification failed'
    };
  }
};

module.exports = { initializePayment, verifyPayment, isValidEmail };
