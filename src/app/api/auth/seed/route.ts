import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    if (process.env.NODE_ENV === 'production') {
      return new Response('Unauthorized', { status: 401 });
    }

    const username = 'oliver';
    const password = 'oliver782828113@$';
    const password_hash = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.upsert({
      where: { username },
      update: {},
      create: {
        username,
        password_hash,
      },
    });

    return NextResponse.json({ success: true, message: `Admin ${admin.username} initialized.` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
