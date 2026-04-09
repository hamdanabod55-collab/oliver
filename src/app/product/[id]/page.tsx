import Navbar from '@/components/Navbar';
import supabase from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ProductActions from '@/components/ProductActions';

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
    const id = parseInt(params.id);
    if (isNaN(id)) notFound();

    const { data: product } = await supabase.from('Product').select('*').eq('id', id).maybeSingle();

    if (!product) notFound();

    const whatsappNumber = "967782828113";

    return (
        <>
            <Navbar />
            <main style={{ minHeight: '100vh', background: 'var(--bg-mesh)', paddingTop: '100px' }}>
                {/* Hero Section */}
                <section style={{ position: 'relative', overflow: 'hidden', paddingBottom: '80px' }}>
                    <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '60px', alignItems: 'center', minHeight: '70vh' }}>
                            
                            {/* Product Image */}
                            <div className="fade-in" style={{ position: 'relative' }}>
                                <div style={{ 
                                    aspectRatio: '1/1', 
                                    background: 'rgba(255,255,255,0.03)', 
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: '48px', 
                                    overflow: 'hidden',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    boxShadow: '0 40px 100px rgba(0,0,0,0.3)',
                                    position: 'relative'
                                }}>
                                    {/* Blurred Background Clone */}
                                    <img 
                                        src={product.image_url} 
                                        alt="" 
                                        style={{ 
                                            position: 'absolute', 
                                            inset: '-10%', 
                                            width: '120%', 
                                            height: '120%', 
                                            objectFit: 'cover', 
                                            filter: 'blur(30px) brightness(0.6)',
                                            zIndex: 0
                                        }} 
                                    />
                                    <img 
                                        src={product.image_url} 
                                        alt={product.name} 
                                        style={{ 
                                            width: '100%', 
                                            height: '100%', 
                                            objectFit: 'contain', 
                                            position: 'relative',
                                            zIndex: 1,
                                            transition: 'transform 0.5s ease' 
                                        }} 
                                        className="product-hero-img"
                                    />
                                    <div style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', padding: '12px 24px', borderRadius: '99px', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--color-milk)', fontWeight: 700, zIndex: 2 }}>
                                        #{product.category}
                                    </div>
                                </div>
                                {/* Decorative elements */}
                                <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'rgba(193, 170, 147, 0.2)', filter: 'blur(80px)', top: '-50px', left: '-50px', zIndex: -1 }}></div>
                            </div>

                            {/* Info Card */}
                            <div className="glass-card fade-in-up" style={{ padding: '60px 40px', borderRadius: '48px' }}>
                                <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--color-milk)', marginBottom: '16px', fontWeight: 800, lineHeight: 1.1 }}>{product.name}</h1>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                                    <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-beige)', marginBottom: '16px' }}>{product.price} YR</p>
                                    <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '8px', fontSize: '1rem', color: 'var(--color-milk)', opacity: 0.7 }}>متوفر في المخزون</span>
                                </div>

                                <div style={{ marginBottom: '40px' }}>
                                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.25rem', lineHeight: 1.8 }}>{product.description}</p>
                                </div>

                                <ProductActions product={{
                                    id: product.id,
                                    name: product.name,
                                    price: Number(product.price),
                                    image_url: product.image_url
                                }} whatsappNumber={whatsappNumber} />

                                {/* Extra info */}
                                <div style={{ marginTop: '40px', paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '12px' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                                        </div>
                                        <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>ضمان سنتين</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '12px' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v4h20Z"/><path d="M2 18v1a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-1"/><rect width="20" height="8" x="2" y="10" rx="2"/></svg>
                                        </div>
                                        <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>شحن سريع</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section style={{ padding: '100px 0', background: 'rgba(0,0,0,0.2)' }}>
                    <div className="container">
                        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                            <h2 style={{ fontSize: '3rem', marginBottom: '16px' }}>نضمن لك <span className="text-brown">الأفضل</span></h2>
                            <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '600px', margin: '0 auto' }}>كل قطعة لدينا تم اختيارها بعناية لتضمن لك أداءً فائقاً وتصميماً لا يضاهى.</p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
                            {[
                                { title: "دفع آمن", desc: "تشفير كامل لبياناتك وضمان لعملية الشراء.", icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> },
                                { title: "جودة أصلية", desc: "منتجاتنا أصلية 100% وبضمان العلامة التجارية.", icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 15 2 2 4-4"/><rect width="20" height="20" x="2" y="2" rx="2"/></svg> },
                                { title: "خدمة عملاء", desc: "فريق دعم مخصص للإجابة على جميع استفساراتك.", icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/></svg> }
                            ].map((feature, i) => (
                                <div key={i} className="glass-card" style={{ padding: '40px', borderRadius: '32px', textAlign: 'center' }}>
                                    <div style={{ color: 'var(--color-beige)', marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>{feature.icon}</div>
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--color-milk)' }}>{feature.title}</h3>
                                    <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.6' }}>{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                .fade-in { animation: fadeIn 1s ease-out forwards; }
                .fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
                .product-hero-img:hover { transform: scale(1.05); }
            `}</style>
        </>
    );
}
