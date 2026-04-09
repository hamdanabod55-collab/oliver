import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';
import { SignJWT } from 'jose';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
});

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'oliver_default_secret_key_123');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = forgotPasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ 
        error: result.error.issues[0].message 
      }, { status: 400 });
    }

    const { email } = result.data;

    // Find user
    const { data: user, error } = await supabase.from('User').select('id').eq('email', email).maybeSingle();

    if (error) {
        console.error('[Supabase ForgotPassword Error]', error);
        return NextResponse.json({ error: 'حدث خطأ في قاعدة البيانات' }, { status: 503 });
    }

    // SECURITY: Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ 
        success: true, 
        message: 'إذا كان البريد الإلكتروني مسجلاً، فستتلقى رابطاً لإعادة تعيين كلمة المرور قريباً.' 
      });
    }

    // Generate a secure reset token
    const resetToken = await new SignJWT({ 
        userId: user.id, 
        purpose: 'password_reset' 
      })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h') // Token expires in 1 hour
      .sign(JWT_SECRET);

    // In a real production system, you would send this token via an email service (e.g., SendGrid, Resend)
    // For this implementation, we simulate the action and log the token for development visibility
    console.log(`[SECURE] Reset token generated for ${email}: ${resetToken}`);

    return NextResponse.json({ 
      success: true, 
      message: 'إذا كان البريد الإلكتروني مسجلاً، فستتلقى رابطاً لإعادة تعيين كلمة المرور قريباً.' 
    });

  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ 
      error: 'حدث خطأ داخلي في الخادم' 
    }, { status: 500 });
  }
}
