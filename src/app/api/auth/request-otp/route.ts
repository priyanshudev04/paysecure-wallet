import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { checkRateLimit, setOtp } from '@/lib/redis';

export async function POST(req: Request) {
  try {
    const { phoneNumber } = await req.json();

    if (!phoneNumber || !/^\+?[1-9]\d{1,14}$/.test(phoneNumber)) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }

    const isAllowed = await checkRateLimit(phoneNumber);
    if (!isAllowed) {
      return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    // Store in Redis
    await setOtp(phoneNumber, hashedOtp);

    // Mock sending OTP
    console.log(`[MOCK OTP] Phone: ${phoneNumber}, OTP: ${otp}`);

    return NextResponse.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Request OTP error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
