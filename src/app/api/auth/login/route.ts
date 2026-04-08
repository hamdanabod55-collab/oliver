import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js'; // استبدال بريسما بـ سوبابيز
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { z } from 'zod';

// إعداد سوبابيز باستخدام المتغيرات التي سحبها فيرسيل تلقائياً
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'oliver_default_secret_key_123');

const loginRateLimiter = new Map<string, { count: number, resetTime: number }>();
const LOGIN_LIMIT = 5;
const LOGIN_WINDOW = 15 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const userLimit = loginRateLimiter.get(ip);

    if (userLimit && now < userLimit.resetTime) {
      if (userLimit.count >= LOGIN_LIMIT) {
        return NextResponse.json({ error: 'Too many attempts. Try again in 15 minutes.' }, { status: 429 });
      }
      userLimit.count++;
    } else {
      loginRateLimiter.set(ip, { count: 1, resetTime: now + LOGIN_WINDOW });
    }

    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const { username, password } = result.data;

    // --- التعديل هنا: جلب البيانات باستخدام Supabase SDK بدلاً من Prisma ---
    const { data: admin, error: dbError } = await supabase
      .from('admin') // تأكد أن اسم الجدول في سوبابيز هو admin صغير
      .select('*')
      .eq('username', username)
      .single();

    if (dbError || !admin) {
      console.error('Database error:', dbError);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    // -------------------------------------------------------------

    const passwordMatch = await bcrypt.compare(password, admin.password_hash);

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await new SignJWT({ userId: admin.id, username: admin.username })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(JWT_SECRET);

    const response = NextResponse.json({ success: true, message: 'Login successful' });
    
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
