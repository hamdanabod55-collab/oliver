import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
});

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'oliver_default_secret_key_123');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ 
        error: result.error.issues[0].message 
      }, { status: 400 });
    }

    const { email, password } = result.data;

    // Find user
    const { data: user, error } = await supabase.from('user').select('*').eq('email', email).maybeSingle();

    if (error) {
        console.error('[Supabase Login Select Error]', error);
        return NextResponse.json({ error: 'حدث خطأ في قاعدة البيانات' }, { status: 503 });
    }

    if (!user || !user.password_hash) {
      return NextResponse.json({ 
        error: 'بيانات الاعتماد غير صالحة' 
      }, { status: 401 });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return NextResponse.json({ 
        error: 'بيانات الاعتماد غير صالحة' 
      }, { status: 401 });
    }

    // Generate Token
    const token = await new SignJWT({ 
        userId: user.id, 
        email: user.email,
        name: user.name 
      })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET);

    const response = NextResponse.json({ 
      success: true, 
      message: 'تم تسجيل الدخول بنجاح',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
    
    // Set cookie
    response.cookies.set('customer_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ 
      error: 'حدث خطأ داخلي في الخادم' 
    }, { status: 500 });
  }
}
