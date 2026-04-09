import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
  category: z.string().min(1),
  subcategory: z.string().optional().nullable(),
  isFeatured: z.boolean().optional(),
  image_url: z.string().min(1),
});

export async function GET() {
  try {
    const { data: products, error } = await supabase.from('product').select('*').order('createdAt', { ascending: false });
    if (error) {
        console.error('[Supabase GET products Error]', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('API POST - Received body:', body);
    const result = productSchema.safeParse(body);

    if (!result.success) {
      console.warn('API POST - Validation failed:', result.error.issues);
      return NextResponse.json({ error: result.error.issues }, { status: 400 });
    }

    const data = {
      ...result.data,
      subcategory: result.data.subcategory || null
    };

    const { data: product, error: insertError } = await supabase.from('product').insert([data]).select().single();

    if (insertError) {
        throw insertError;
    }

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('API POST - Prisma error:', error);
    return NextResponse.json({ 
      error: 'Failed to create product', 
      message: error.message || String(error)
    }, { status: 500 });
  }
}
