import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'oliver_default_secret_key_123');

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin/dashboard and /api/admin
  if (pathname.startsWith('/admin/dashboard') || pathname.startsWith('/api/admin')) {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Invalid Token' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/dashboard/:path*', '/api/admin/:path*'],
};
