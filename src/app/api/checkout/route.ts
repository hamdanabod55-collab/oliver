import { NextResponse } from 'next/server';
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';
import prisma from '@/lib/prisma';

// 1. Zod Schema for Validation
const checkoutSchema = z.object({
    name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل").max(100),
    phone: z.string().regex(/^\+?\d{9,15}$/, "رقم الجوال غير صحيح"),
    city: z.string().min(2, "المدينة مطلوبة").max(100),
    address: z.string().min(5, "العنوان التفصيلي مطلوب").max(200),
    cart: z.array(z.object({
        id: z.number(),
        title: z.string(),
        price: z.string(), // We will validate this format
        quantity: z.number().min(1)
    })).min(1, "السلة فارغة")
});

// 2. Simple In-Memory Rate Limiter (Spam Protection)
const rateLimiter = new Map<string, { count: number, resetTime: number }>();
const RATE_LIMIT = 5; // max 5 requests
const TIME_WINDOW = 60 * 1000; // 1 minute

export async function POST(req: Request) {
    try {
        // Rate Limiting Logic based on IP
        const ip = req.headers.get('x-forwarded-for') || 'unknown';
        const now = Date.now();
        const userLimit = rateLimiter.get(ip);

        if (userLimit) {
            if (now < userLimit.resetTime) {
                if (userLimit.count >= RATE_LIMIT) {
                    return NextResponse.json({ error: "تم تجاوز الحد المسموح من الطلبات. يرجى المحاولة لاحقاً." }, { status: 429 });
                }
                userLimit.count++;
            } else {
                rateLimiter.set(ip, { count: 1, resetTime: now + TIME_WINDOW });
            }
        } else {
            rateLimiter.set(ip, { count: 1, resetTime: now + TIME_WINDOW });
        }

        // Parse JSON body
        const body = await req.json();

        // 3. Validate with Zod
        const result = checkoutSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: "بيانات غير صالحة", details: result.error.issues }, { status: 400 });
        }

        const data = result.data;

        // 4. Sanitize Inputs (Sanitization)
        const sanitizedName = DOMPurify.sanitize(data.name);
        const sanitizedCity = DOMPurify.sanitize(data.city);
        const sanitizedAddress = DOMPurify.sanitize(data.address);

        // 5. Server-side Calculation verification
        let subtotal = 0;
        let message = `*طلب جديد من أوليفر ستور* 🛍️\n\n`;
        message += `*بيانات العميل:*\n`;
        message += `👤 الاسم: ${sanitizedName}\n`;
        message += `📞 الجوال: ${data.phone}\n`;
        message += `📍 المدينة: ${sanitizedCity}\n`;
        message += `🏠 العنوان: ${sanitizedAddress}\n\n`;

        message += `*المنتجات:*\n`;

        for (const item of data.cart) {
            const priceValue = parseFloat(item.price.replace('$', '').replace('YR', '').trim());
            if (isNaN(priceValue)) {
                return NextResponse.json({ error: "سعر المنتج غير صالح" }, { status: 400 });
            }
            subtotal += priceValue * item.quantity;
            message += `- ${item.quantity}x ${DOMPurify.sanitize(item.title)} (${priceValue} YR)\n`;
        }

        message += `\n*الإجمالي: ${subtotal.toFixed(0)} YR*\n`;

        // 6. Save to Database
        try {
            await prisma.order.create({
                data: {
                    customer_name: sanitizedName,
                    customer_phone: data.phone,
                    city: sanitizedCity,
                    address: sanitizedAddress,
                    total_price: subtotal,
                    items: JSON.stringify(data.cart),
                    status: 'PENDING'
                }
            });
        } catch (dbError) {
            console.error("Database Save Error:", dbError);
            // We still proceed to WhatsApp even if DB fails for now, or you can opt to throw error
        }

        // Generate WhatsApp URL
        const storePhone = '+967782828113'; 
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${storePhone}?text=${encodedMessage}`;

        return NextResponse.json({ success: true, url: whatsappUrl });

    } catch (error) {
        console.error("Checkout Error:", error);
        return NextResponse.json({ error: "حدث خطأ داخلي" }, { status: 500 });
    }
}
