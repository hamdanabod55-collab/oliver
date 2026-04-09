import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    if (process.env.NODE_ENV === 'production') {
      return new Response('Unauthorized', { status: 401 });
    }

    const username = 'oliver';
    const password = 'oliver782828113@$';
    const password_hash = await bcrypt.hash(password, 10);

    const { data: adminExists } = await supabase.from('Admin').select('id').eq('username', username).maybeSingle();

    if (!adminExists) {
        await supabase.from('Admin').insert([{
            username,
            password_hash,
        }]);
    }

    return NextResponse.json({ success: true, message: `Admin ${username} initialized.` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
