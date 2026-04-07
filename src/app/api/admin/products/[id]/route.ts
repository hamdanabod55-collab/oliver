import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  stock: z.number().int().nonnegative().optional(),
  category: z.string().min(1).optional(),
  subcategory: z.string().optional().nullable(),
  isFeatured: z.boolean().optional(),
  image_url: z.string().min(1).optional(),
});

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    console.log('API PUT - Received body for ID:', id, body);
    const result = productSchema.safeParse(body);

    if (!result.success) {
      console.warn('API PUT - Validation failed:', result.error.issues);
      return NextResponse.json({ error: result.error.issues }, { status: 400 });
    }

    const data = {
      ...result.data,
      subcategory: result.data.subcategory === "" ? null : result.data.subcategory
    };

    const product = await prisma.product.update({
      where: { id },
      data,
    });

    return NextResponse.json(product);
  } catch (error: any) {
    console.error('API PUT - Prisma error:', error);
    return NextResponse.json({ 
      error: 'Failed to update product', 
      message: error.message || String(error)
    }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    console.log('API DELETE - Attempting to delete product ID:', id);
    await prisma.product.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, message: 'تم حذف المنتج بنجاح' });
  } catch (error: any) {
    console.error('API DELETE - Error:', error);
    return NextResponse.json({ 
      error: 'فشل حذف المنتج', 
      message: error.message || String(error)
    }, { status: 500 });
  }
}
