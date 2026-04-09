import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z.string().min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
  name: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ 
        success: false,
        error: result.error.issues[0].message 
      }, { status: 400 });
    }

    const { email, password, name } = result.data;

    // Hash password
    const password_hash = await bcrypt.hash(password, 12);

    // Create user with error handling
    const { data: user, error } = await supabase.from('user').insert([{
        email,
        password_hash,
        name,
    }]).select('id').single();

    if (error) {
      console.error('[Registration Error - Supabase]', error);
      
      // PostgreSQL unique constraint violation code
      if (error.code === '23505') {
        return NextResponse.json({ 
          success: false,
          error: 'البريد الإلكتروني مسجل بالفعل' 
        }, { status: 400 });
      }

      return NextResponse.json({ 
        success: false,
        error: 'حدث خطأ في قاعدة البيانات. حاول مرة أخرى.' 
      }, { status: 503 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'تم إنشاء الحساب بنجاح',
      userId: user.id 
    }, { status: 201 });

  } catch (error: any) {
    // Structured logic for Vercel
    console.error('[Registration Network/Internal Error]', {
      message: error.message,
      stack: error.stack
    });

    return NextResponse.json({ 
      success: false,
      error: 'حدث خطأ داخلي في الخادم. يرجى المحاولة مرة أخرى.' 
    }, { status: 500 });
  }
}
