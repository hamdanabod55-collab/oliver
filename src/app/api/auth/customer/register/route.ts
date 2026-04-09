import supabase from '@/lib/supabase'; // الربط الجديد اللي عملناه
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    
    // تشفير كلمة السر
    const hashedPassword = await bcrypt.hash(password, 10);

    // الحفظ في سوبابيز مباشرة (بدون بريسما)
    const { data, error } = await supabase
      .from('user') // تأكد إنك سميت الجدول user في سوبابيز وضغطت Save
      .insert([
        { 
          name, 
          email, 
          password: hashedPassword 
        }
      ]);

    if (error) {
      return NextResponse.json({ error: 'خطأ في قاعدة البيانات: ' + error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'تم التسجيل بنجاح!' });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'حدث خطأ غير متوقع' }, { status: 500 });
  }
}
