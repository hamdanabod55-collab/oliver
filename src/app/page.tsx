import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import BentoGrid from '@/components/BentoGrid';
import ProductCard from '@/components/ProductCard';
import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function Home() {
    let featuredProducts: any[] = [];
    
    try {
        featuredProducts = await prisma.product.findMany({
            where: { isFeatured: true },
            take: 4,
            orderBy: { createdAt: 'desc' }
        });
    } catch (error) {
        console.error("Failed to fetch featured products:", error);
    }

    return (
        <>
            <Navbar />
            <main>
                <Hero />
                <BentoGrid />

                <section className="container" style={{ padding: '60px 24px', marginBottom: '100px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)' }}>منتجات <span className="text-brown">مميزة</span></h2>
                        <Link href="/electronics" className="view-all-btn" style={{ background: 'transparent', border: 'none', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-milk)', textDecoration: 'none' }}>
                            عرض الكل
                            <svg style={{ transform: 'scaleX(-1)' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                        </Link>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                        {featuredProducts.length > 0 ? (
                            featuredProducts.map((product, index) => (
                                <ProductCard
                                    key={product.id}
                                    id={product.id}
                                    title={product.name}
                                    price={`${product.price} YR`}
                                    category={product.category}
                                    image={product.image_url}
                                    delay={index * 100}
                                />
                            ))
                        ) : (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.3)' }}>
                                لا توجد منتجات مميزة متاحة حالياً.
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <style>{`
        .view-all-btn { transition: color 0.2s ease; }
        .view-all-btn:hover { color: var(--color-text-main) !important; }
      `}</style>
        </>
    );
}
