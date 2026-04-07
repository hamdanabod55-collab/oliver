import Navbar from '@/components/Navbar';
import Link from 'next/link';
import Image from 'next/image';

export default function AccessoriesPage() {
    return (
        <>
            <Navbar />
            <main>
                <div style={{ paddingTop: '140px', paddingBottom: '60px', textAlign: 'center' }}>
                    <div className="container">
                        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', marginBottom: '16px', color: 'var(--color-milk)', fontFamily: 'var(--font-cairo)' }}>
                            <span className="text-brown">إكسسوارات</span> فاخرة
                        </h1>
                        <p style={{ color: 'var(--color-milk)', opacity: 1, fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto', marginBottom: '40px' }}>
                            اكتشف تشكيلتنا الحصرية من الساعات الفاخرة التي تعكس شخصيتك الفريدة.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px', maxWidth: '800px', margin: '0 auto' }}>
                            {/* Men's Watches */}
                            <Link href="/accessories/mens-watches" className="avatar-btn glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '40px 20px', textDecoration: 'none', borderRadius: '32px', transition: 'transform 0.3s ease, background 0.3s ease' }}>
                                <div style={{ position: 'relative', width: '160px', height: '160px', borderRadius: '50%', overflow: 'hidden', border: '4px solid var(--color-milk)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                                    <Image src="https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?auto=format&fit=crop&q=80&w=400" alt="ساعات رجالية" fill style={{ objectFit: 'cover' }} />
                                </div>
                                <h3 style={{ fontSize: '1.5rem', color: 'var(--color-milk)', fontWeight: 700 }}>ساعات رجالية</h3>
                                <span style={{ color: 'var(--color-text-main)', background: 'var(--color-milk)', padding: '8px 24px', borderRadius: '24px', fontSize: '0.875rem', fontWeight: 600 }}>تصفح الآن</span>
                            </Link>

                            {/* Women's Watches */}
                            <Link href="/accessories/womens-watches" className="avatar-btn glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '40px 20px', textDecoration: 'none', borderRadius: '32px', transition: 'transform 0.3s ease, background 0.3s ease' }}>
                                <div style={{ position: 'relative', width: '160px', height: '160px', borderRadius: '50%', overflow: 'hidden', border: '4px solid var(--color-milk)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                                    <Image src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400" alt="ساعات نسائية" fill style={{ objectFit: 'cover' }} />
                                </div>
                                <h3 style={{ fontSize: '1.5rem', color: 'var(--color-milk)', fontWeight: 700 }}>ساعات نسائية</h3>
                                <span style={{ color: 'var(--color-text-main)', background: 'var(--color-milk)', padding: '8px 24px', borderRadius: '24px', fontSize: '0.875rem', fontWeight: 600 }}>تصفح الآن</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <style>{`
                .avatar-btn:hover {
                    transform: translateY(-10px);
                    background: rgba(255, 255, 255, 0.1) !important;
                }
            `}</style>
        </>
    );
}
