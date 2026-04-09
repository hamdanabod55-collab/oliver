import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function GET() {
  try {
    const products = [
      {
        name: 'سماعات Bose QuietComfort Ultra',
        description: 'أفضل سماعات عازلة للضجيج في العالم مع صوت غامر ومريح جداً.',
        price: 429,
        stock: 15,
        category: 'electronics',
        image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'ساعة Apple Watch Series 9',
        description: 'الساعة الذكية الأكثر مبيعاً مع قدرات صحية متقدمة ومعالج S9 القوي.',
        price: 399,
        stock: 20,
        category: 'electronics',
        image_url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'قلم Apple Pencil (الجيل الثاني)',
        description: 'الأداة المثالية للرسم وندوين الملاحظات على iPad برو وiPad إير.',
        price: 129,
        stock: 30,
        category: 'accessories',
        image_url: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'حقيبة لابتوب Bellroy Tokyo',
        description: 'تصميم أنيق وبسيط مع حماية ممتازة لجهازك وتنظيم ذكي.',
        price: 179,
        stock: 10,
        category: 'accessories',
        image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'نظارة Ray-Ban Meta الذكية',
        description: 'استمتع بالتصوير والبث المباشر والموسيقى مباشرة من نظارتك الأنيقة.',
        price: 299,
        stock: 8,
        category: 'other',
        image_url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800'
      }
    ];

    for (const p of products) {
        const { data: exists } = await supabase.from('Product').select('id').eq('name', p.name).maybeSingle();
        if (!exists) {
            await supabase.from('Product').insert([p]);
        }
    }

    return NextResponse.json({ success: true, message: "Sample products seeded successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
