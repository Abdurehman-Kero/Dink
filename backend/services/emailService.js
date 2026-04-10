const nodemailer = require('nodemailer');

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send welcome email
const sendWelcomeEmail = async (user) => {
  const mailOptions = {
    from: `"DEMS Team" <${process.env.EMAIL_FROM || 'noreply@dems.com'}>`,
    to: user.email,
    subject: 'Welcome to DEMS - Dinkenesh Event Management System',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e3a2f, #2d5a3f); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">ዲ ዲ ሰ</h1>
          <p style="color: #fbbf24; margin: 5px 0 0;">DEMS Event Platform</p>
        </div>
        
        <div style="padding: 30px; background: white;">
          <h2 style="color: #1e3a2f;">Welcome to DEMS, ${user.full_name}!</h2>
          
          <p style="color: #4b5563; line-height: 1.6;">
            Thank you for joining DEMS - Ethiopia's premier event management platform. 
            You're now ready to discover and book amazing events across the country.
          </p>
          
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e3a2f; margin: 0 0 10px;">��� What's Next?</h3>
            <ul style="color: #4b5563; padding-left: 20px;">
              <li>Explore featured events near you</li>
              <li>Save events you're interested in</li>
              <li>Purchase tickets securely</li>
              <li>Access your digital tickets instantly</li>
            </ul>
          </div>
          
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/discover" 
             style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">
            Start Exploring Events
          </a>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            © ${new Date().getFullYear()} DEMS Event Platform. All rights reserved.<br>
            Addis Ababa, Ethiopia
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${user.email}`);
  } catch (error) {
    console.error('❌ Email send failed:', error.message);
  }
};

// Send password reset email
const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: `"DEMS Team" <${process.env.EMAIL_FROM || 'noreply@dems.com'}>`,
    to: user.email,
    subject: 'Password Reset Request - DEMS',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1e3a2f; padding: 20px; text-align: center;">
          <h1 style="color: white;">DEMS</h1>
        </div>
        <div style="padding: 30px;">
          <h2>Password Reset Request</h2>
          <p>Click the button below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">Reset Password</a>
          <p>This link expires in 1 hour.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendWelcomeEmail, sendPasswordResetEmail };
