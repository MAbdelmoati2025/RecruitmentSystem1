// ============================================
// FILE: services/emailService.js
// ============================================

import nodemailer from 'nodemailer';

// Create reusable transporter using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true' || false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Send password reset email
export const sendPasswordResetEmail = async (to, fullName, resetCode, username) => {
  try {
    const transporter = createTransporter();

    // Email HTML template
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f7fa;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          }
          .header {
            background: rgba(255,255,255,0.1);
            padding: 30px;
            text-align: center;
            backdrop-filter: blur(10px);
          }
          .logo {
            font-size: 36px;
            font-weight: bold;
            color: white;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
          }
          .content {
            background: white;
            padding: 40px 30px;
          }
          .greeting {
            font-size: 24px;
            color: #333;
            margin-bottom: 20px;
            font-weight: 600;
          }
          .message {
            color: #666;
            line-height: 1.8;
            font-size: 16px;
            margin-bottom: 30px;
          }
          .code-container {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 15px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
          }
          .code-label {
            color: rgba(255,255,255,0.9);
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 15px;
          }
          .code {
            font-size: 48px;
            font-weight: bold;
            color: white;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
          }
          .expiry {
            color: rgba(255,255,255,0.8);
            font-size: 13px;
            margin-top: 15px;
          }
          .warning {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 25px 0;
            border-radius: 5px;
            color: #856404;
            font-size: 14px;
          }
          .footer {
            background: #f8f9fa;
            padding: 25px;
            text-align: center;
            color: #6c757d;
            font-size: 13px;
            border-top: 1px solid #e9ecef;
          }
          .footer a {
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
          }
          .security-tips {
            background: #e7f3ff;
            border-left: 4px solid #2196F3;
            padding: 15px;
            margin: 25px 0;
            border-radius: 5px;
            font-size: 14px;
            color: #0d47a1;
          }
          .security-tips strong {
            display: block;
            margin-bottom: 8px;
            color: #1565c0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🔐 Nexploy</div>
          </div>
          
          <div class="content">
            <div class="greeting">Hello, ${fullName}! 👋</div>
            
            <div class="message">
              We received a request to reset the password for your Nexploy account (<strong>${username}</strong>).
              <br><br>
              Use the verification code below to reset your password:
            </div>
            
            <div class="code-container">
              <div class="code-label">Your Reset Code</div>
              <div class="code">${resetCode}</div>
              <div class="expiry">⏰ Valid for 15 minutes</div>
            </div>
            
            <div class="warning">
              ⚠️ <strong>Important:</strong> If you didn't request a password reset, please ignore this email or contact your administrator immediately.
            </div>
            
            <div class="security-tips">
              <strong>🛡️ Security Tips:</strong>
              • Never share this code with anyone<br>
              • Our team will never ask for your reset code<br>
              • This code expires in 15 minutes<br>
              • Each code can only be used once
            </div>
            
            <div class="message">
              If you have any questions or need assistance, please contact your system administrator.
            </div>
          </div>
          
          <div class="footer">
            <strong>Nexploy Recruitment System</strong><br>
            Smart Recruitment Made Easy<br><br>
            © 2025 Mohamed Abdelmoati. All rights reserved.<br>
            <a href="#">Privacy Policy</a> • <a href="#">Terms of Service</a>
          </div>
        </div>
      </body>
      </html>
    `;

    // Plain text version for email clients that don't support HTML
    const textContent = `
Hello ${fullName}!

We received a request to reset the password for your Nexploy account (${username}).

Your Reset Code: ${resetCode}
Valid for: 15 minutes

If you didn't request a password reset, please ignore this email or contact your administrator immediately.

Security Tips:
- Never share this code with anyone
- Our team will never ask for your reset code
- This code expires in 15 minutes
- Each code can only be used once

© 2025 Nexploy Recruitment System
    `;

    // Send email
    const info = await transporter.sendMail({
      from: `"Nexploy System" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: '🔐 Password Reset Code - Nexploy',
      text: textContent,
      html: htmlContent
    });

    console.log('✅ Password reset email sent successfully to:', to);
    console.log('📧 Message ID:', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId
    };

  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    throw new Error('Failed to send reset email');
  }
};

// Test email connection
export const testEmailConnection = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email server connection successful');
    return true;
  } catch (error) {
    console.error('❌ Email server connection failed:', error);
    return false;
  }
};

export default {
  sendPasswordResetEmail,
  testEmailConnection
};