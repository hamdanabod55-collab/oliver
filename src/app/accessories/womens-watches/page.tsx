import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import supabase from '@/lib/supabase';

export default async function WomensWatchesPage() {
    let products: any[] = [];
    
    try {
        const { data } = await supabase.from('Product')
            .select('*')
            .eq('category', 'accessories')
            .eq('subcategory', 'Women')
            .order('createdAt', { ascending: false });
        if (data) products = data;
    } catch (error) {
        console.error("Failed to fetch womens watches:", error);
    }

    return (
        <>
            <Navbar />
            <main>
                <div style={{ paddingTop: '140px', paddingBottom: '60px', textAlign: 'center' }}>
                    <div className="container">
                        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', marginBottom: '16px', color: 'var(--color-milk)', fontFamily: 'var(--font-cairo)' }}>
                            ساعات <span className="text-brown">نسائية</span>
                        </h1>
                        <p style={{ color: 'var(--color-milk)', opacity: 1, fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
                            تصاميم ساحرة تعكس الأنوثة والفخامة في كل تفصيل.
                        </p>
                    </div>
                </div>
                
                <section className="container" style={{ padding: '0 24px 100px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                        {products.length > 0 ? (
                            products.map((product, index) => (
                                <ProductCard
                                    key={product.id}
                                    id={product.id}
                                    title={product.name}
                                    price={`${product.price} YR`}
                                    category={product.subcategory || product.category}
                                    image={product.image_url}
                                    delay={index * 50}
                                />
                            ))
                        ) : (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.3)' }}>
                                لا توجد منتجات مضافة في هذا القسم حالياً.
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
}
