import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function GET() {
  try {
    const { data: orders, error } = await supabase.from('Order').select('*').order('createdAt', { ascending: false });
    if (error) throw error;
    return NextResponse.json(orders);
  } catch (error) {
    console.error('[Supabase GET Orders]', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
