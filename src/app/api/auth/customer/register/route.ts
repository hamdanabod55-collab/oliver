import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
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
        error: result.error.issues[0].message 
      }, { status: 400 });
    }

    const { email, password, name } = result.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ 
        error: 'البريد الإلكتروني مسجل بالفعل' 
      }, { status: 400 });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password_hash,
        name,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'تم إنشاء الحساب بنجاح',
      userId: user.id 
    }, { status: 201 });

  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ 
      error: 'حدث خطأ داخلي في الخادم' 
    }, { status: 500 });
  }
}
